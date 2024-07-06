import { GenericEvent } from '@contracts/events';
import { Webhook } from '@prisma/client';

export class WebhookCreatedEvent extends GenericEvent<Webhook> {}
