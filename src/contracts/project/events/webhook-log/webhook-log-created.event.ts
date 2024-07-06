import { GenericEvent } from '@contracts/events';
import { WebhookLog } from '@prisma/client';

export class WebhookLogCreatedEvent extends GenericEvent<WebhookLog> {}
