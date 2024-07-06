import { GenericEvent } from '@contracts/events';
import { Webhook } from '@prisma/client';

export class WebhookDeletedEvent extends GenericEvent<Webhook> {}
