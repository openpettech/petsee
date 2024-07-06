import { GenericEvent } from '@contracts/events';
import { WebhookLog } from '@prisma/client';

export class WebhookLogUpdatedEvent extends GenericEvent<WebhookLog> {}
