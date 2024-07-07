import * as Joi from 'joi';

export const validationSchema = Joi.object({
  APP_ID: Joi.string().uuid({ version: 'uuidv4' }).required(),
  NODE_ENV: Joi.string().required(),
  PORT: Joi.number().required(),
  DOMAIN: Joi.string().required(),

  DATABASE_URL: Joi.string().required(),
  DATABASE_REPLICA_URL_1: Joi.string().required(),

  REDIS_DEFAULT_TTL: Joi.number().required(),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
  REDIS_PASSWORD: Joi.string().required(),

  SEARCH_PROVIDER: Joi.string().optional().default(null),
  MEILISEARCH_HOST: Joi.string().optional().default(null),
  MEILISEARCH_API_KEY: Joi.string().optional().default(null),

  OBJECT_STORAGE_PROVIDER: Joi.string().required(),
  OBJECT_STORAGE_DOMAIN: Joi.string().required(),
  MINIO_ENDPOINT: Joi.string().optional().default(null),
  MINIO_PORT: Joi.number().optional().default(null),
  MINIO_SSL: Joi.string().optional().default(null),
  MINIO_ACCESS_KEY: Joi.string().optional().default(null),
  MINIO_SECRET_KEY: Joi.string().optional().default(null),

  AUTH0_ISSUER_URL: Joi.string().required(),
  AUTH0_AUDIENCE: Joi.string().required(),

  SENTRY_DNS: Joi.string().optional().default(null),

  SMS_PROVIDER: Joi.string().required(),
  TWILIO_ACCOUNT_SID: Joi.string().optional().default(null),
  TWILIO_AUTH_TOKEN: Joi.string().optional().default(null),
  TWILIO_MESSAGING_SERVICE_SID: Joi.string().optional().default(null),
});
