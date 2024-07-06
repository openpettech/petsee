import helmet from 'helmet';
import type { INestApplication } from '@nestjs/common';

const corsOptionsDelegate = function (req: any, callback: any) {
  const corsOptions = {
    origin: false as boolean | string | string[],
    preflightContinue: false,
    allowedHeaders: ['Content-Type', 'Authorization', 'sentry-trace'],
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  };

  if (['dev', 'test', 'local'].includes(process.env.NODE_ENV as string)) {
    corsOptions.origin = '*';
  }
  callback(null, corsOptions);
};

export function setupSecurity(app: INestApplication) {
  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );
  app.enableCors(corsOptionsDelegate);
}
