import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Sentry from '@sentry/node';

export function setupMonitoring(app: INestApplication) {
  const configService = app.get(ConfigService);

  const sentryDns = configService.get('monitoring.sentry.dns');
  if (!!sentryDns) {
    Sentry.init({
      dsn: sentryDns,
    });
  }
}
