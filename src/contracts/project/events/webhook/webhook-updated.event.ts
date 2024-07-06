import { GenericEvent } from '@contracts/events';
import { Webhook } from '@prisma/client';

export class WebhookUpdatedEvent extends GenericEvent<Webhook> {}
