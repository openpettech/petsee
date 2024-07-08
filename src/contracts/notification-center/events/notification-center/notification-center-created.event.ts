import { GenericEvent } from '@contracts/events';
import { NotificationCenter } from '@prisma/client';

export class NotificationCenterCreatedEvent extends GenericEvent<NotificationCenter> {}
