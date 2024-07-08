import { GenericEvent } from '@contracts/events';
import { NotificationCenter } from '@prisma/client';

export class NotificationCenterUpdatedEvent extends GenericEvent<NotificationCenter> {}
