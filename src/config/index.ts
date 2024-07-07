import { IConfig } from './interfaces/config.interface';

export function config(): IConfig {
  return {
    id: process.env.APP_ID,
    port: parseInt(process.env.PORT, 10),
    domain: process.env.DOMAIN,
    db: {
      url: process.env.DATABASE_URL,
      replica: process.env.DATABASE_REPLICA_URL_1,
    },
    search: {
      provider: process.env.SEARCH_PROVIDER,
      meilisearch: {
        host: process.env.MEILISEARCH_HOST,
        apiKey: process.env.MEILISEARCH_API_KEY,
      },
    },
    objectStorage: {
      provider: process.env.OBJECT_STORAGE_PROVIDER,
      domain: process.env.OBJECT_STORAGE_DOMAIN,
      minio: {
        endpoint: process.env.MINIO_ENDPOINT,
        port: parseInt(process.env.MINIO_PORT, 10),
        ssl: process.env.MINIO_SSL === 'true',
        accessKey: process.env.MINIO_ACCESS_KEY,
        secretKey: process.env.MINIO_SECRET_KEY,
      },
    },
    cache: {
      ttl: parseInt(process.env.REDIS_DEFAULT_TTL, 10),
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT, 10),
      password: process.env.REDIS_PASSWORD,
    },
    auth: {
      issuer: process.env.AUTH0_ISSUER_URL,
      audience: process.env.AUTH0_AUDIENCE,
    },
    communication: {
      sms: {
        provider: process.env.SMS_PROVIDER,
        ...(process.env.SMS_PROVIDER === 'twilio'
          ? {
              twilio: {
                accountSid: process.env.TWILIO_ACCOUNT_SID,
                authToken: process.env.TWILIO_AUTH_TOKEN,
                messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
              },
            }
          : {}),
      },
    },
    monitoring: {
      ...(!!process.env.SENTRY_DNS
        ? {
            sentry: {
              dns: process.env.SENTRY_DNS,
            },
          }
        : {}),
    },
  };
}
