import { GenericEvent } from '@contracts/events';
import { SmsLog } from '@prisma/client';

export class SmsLogCreatedEvent extends GenericEvent<SmsLog> {}
