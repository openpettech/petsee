import { Global, Module, Provider } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService, ConditionalModule } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import {
  I18nModule,
  AcceptLanguageResolver,
  QueryResolver,
  HeaderResolver,
} from 'nestjs-i18n';
import { join } from 'path';
import { MinioModule } from 'nestjs-minio-client';
import { validationSchema } from '@config/config.schema';
import { config } from '@config/index';
import { RavenModule, RavenInterceptor } from 'nest-raven';
import { MinioService } from 'nestjs-minio-client';

import {
  EventsService,
  CacheService,
  PrismaService,
  ObjectStorageService,
  MinioStorageService,
  SearchService,
  MeilisearchService,
} from './services';

const providers: Provider[] = [
  EventsService,
  CacheService,
  PrismaService,
  {
    provide: ObjectStorageService,
    useFactory: (configService: ConfigService, minioService: MinioService) => {
      const storageProvider = configService.get<string>(
        'OBJECT_STORAGE_PROVIDER',
      );
      switch (storageProvider) {
        case 'minio':
          return new MinioStorageService(configService, minioService);
        default:
          throw new Error(`Unsupported storage type: ${storageProvider}`);
      }
    },
    inject: [ConfigService, MinioService],
  },
  {
    provide: SearchService,
    useFactory: (configService: ConfigService) => {
      const searchProvider = configService.get<string>('SEARCH_PROVIDER');
      if (!searchProvider) {
        return null;
      }

      switch (searchProvider) {
        case 'meilisearch':
          return new MeilisearchService(configService);
        default:
          throw new Error(`Unsupported storage type: ${searchProvider}`);
      }
    },
    inject: [ConfigService],
  },
];

@Global()
@Module({
  imports: [
    EventEmitterModule.forRoot({
      global: true,
      wildcard: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      load: [config],
    }),
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: configService.getOrThrow('I18N_FALLBACK_LANGUAGE'),
        loaderOptions: {
          path: join(__dirname, '/src/i18n/'),
          watch: true,
        },
      }),
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ttl: Number(configService.get('REDIS_DEFAULT_TTL')),
        isGlobal: true,
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        port: Number(configService.get('REDIS_PORT')),
        auth_pass: configService.get('REDIS_PASSWORD'),
        no_ready_check: true,
      }),
      inject: [ConfigService],
    }),
    MinioModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        endPoint: configService.getOrThrow('MINIO_ENDPOINT'),
        port: Number(configService.getOrThrow('MINIO_PORT')),
        useSSL: configService.getOrThrow('MINIO_SSL') === 'true',
        accessKey: configService.getOrThrow('MINIO_ACCESS_KEY'),
        secretKey: configService.getOrThrow('MINIO_SECRET_KEY'),
        isGlobal: true,
      }),
    }),
    ConditionalModule.registerWhen(
      RavenModule,
      (env: NodeJS.ProcessEnv) => !!env['SENTRY_DNS'],
    ),
  ],
  providers: [
    ...providers,
    {
      provide: APP_INTERCEPTOR,
      useValue: new RavenInterceptor(),
    },
  ],
  exports: [CacheModule, MinioModule, ConfigModule, I18nModule, ...providers],
})
export class CoreModule {}
