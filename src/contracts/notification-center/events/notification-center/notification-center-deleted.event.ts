import { GenericEvent } from '@contracts/events';
import { NotificationCenter } from '@prisma/client';

export class NotificationCenterDeletedEvent extends GenericEvent<NotificationCenter> {}
