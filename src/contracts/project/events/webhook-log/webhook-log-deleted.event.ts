import { GenericEvent } from '@contracts/events';
import { WebhookLog } from '@prisma/client';

export class WebhookLogDeletedEvent extends GenericEvent<WebhookLog> {}
