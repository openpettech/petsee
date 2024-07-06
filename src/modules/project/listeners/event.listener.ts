import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { HttpService } from '@nestjs/axios';

import { GenericEvent } from '@contracts/events';
import { WebhookService, WebhookLogService } from '../services';
import { WebhookRequestStatus } from '@prisma/client';
import { Context } from '@contracts/common';

@Injectable()
export class WebhookEventListener {
  private readonly logger = new Logger(WebhookEventListener.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly webhookService: WebhookService,
    private readonly webhookLogService: WebhookLogService,
  ) {}

  @OnEvent('**')
  async handleAllEvents(event: GenericEvent<any>) {
    this.logger.debug(`Received event:`, JSON.stringify(event, null, 2));

    if (!event.projectId) {
      this.logger.log('No project ID');
    }

    const { items: webhooks } = await this.webhookService.findAll(
      {} as Context,
      {
        offset: 0,
        limit: 100,
      },
      {
        projectId: event.projectId,
      },
    );

    if (!webhooks.length) {
      this.logger.log('No webhooks');
    }

    await Promise.all(
      webhooks.map(async (webhook) => {
        try {
          if (!webhook.events.includes(event.eventName)) {
            this.logger.log(
              `[Project:${webhook.projectId}][Webhook:${webhook.id}] Does not support - ${event.eventName}`,
            );
            return;
          }

          const { data, status, headers } =
            await this.httpService.axiosRef.post(webhook.url, event);
          this.logger.log(
            `[Project:${webhook.projectId}][Webhook:${webhook.id}] ${event.eventName} sent`,
          );

          const input = {
            data,
            status,
            headers,
          };

          await this.webhookLogService.create({} as Context, {
            webhookId: webhook.id,
            projectId: webhook.projectId,
            request: event,
            response: input,
            status: WebhookRequestStatus.SUCCEEDED,
            createdBy: {
              service: 'project',
              serviceDetail: 'Webhook Log created',
            },
          });
        } catch (err) {
          this.logger.error(
            `[Project:${webhook.projectId}][Webhook:${webhook.id}] Error - ${err.message}}`,
          );
          await this.webhookLogService.create({} as Context, {
            webhookId: webhook.id,
            projectId: webhook.projectId,
            request: event,
            response: err,
            status: WebhookRequestStatus.ERRORED,
            createdBy: {
              service: 'project',
              serviceDetail: 'Webhook Log created',
            },
          });
        }
      }),
    );
  }
}
