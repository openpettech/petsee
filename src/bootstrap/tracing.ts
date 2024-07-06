import {
  SimpleSpanProcessor,
  BatchSpanProcessor,
} from '@opentelemetry/sdk-trace-base';
import { NodeSDK } from '@opentelemetry/sdk-node';
import * as process from 'process';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { PrismaInstrumentation } from '@prisma/instrumentation';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';

const devExporter = new JaegerExporter({
  endpoint: 'http://localhost:14268/api/traces',
});

const oltpExporter = new OTLPTraceExporter({
  url: `https://api.honeycomb.io/v1/traces`,
  headers: {
    'x-honeycomb-team': process.env.HONEYCOMB_API_KEY,
  },
});

const traceExporter =
  process.env.NODE_ENV !== `production` ? devExporter : oltpExporter;

const spanProcessor =
  process.env.NODE_ENV !== `production`
    ? new SimpleSpanProcessor(traceExporter)
    : new BatchSpanProcessor(traceExporter);

export const otelSDK = new NodeSDK({
  spanProcessor,
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: `xyz`,
  }),
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-fs': {
        enabled: false,
      },
    }),
    new PrismaInstrumentation({
      middleware: true,
    }),
  ],
});

// gracefully shut down the SDK on process exit
process.on('SIGTERM', () => {
  otelSDK
    .shutdown()
    .then(
      () => console.log('SDK shut down successfully'),
      (err) => console.log('Error shutting down SDK', err),
    )
    .finally(() => process.exit(0));
});
