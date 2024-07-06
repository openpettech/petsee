import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import {
  ApiKeyController,
  ProjectController,
  WebhookController,
  WebhookLogController,
} from './controllers';
import { WebhookEventListener } from './listeners';
import {
  ApiKeyService,
  WebhookService,
  WebhookLogService,
  ProjectService,
} from './services';

@Module({
  imports: [HttpModule],
  controllers: [
    ApiKeyController,
    ProjectController,
    WebhookController,
    WebhookLogController,
  ],
  providers: [
    ApiKeyService,
    ProjectService,
    WebhookEventListener,
    WebhookService,
    WebhookLogService,
  ],
  exports: [ApiKeyService, ProjectService, WebhookService, WebhookLogService],
})
export class ProjectModule {}
