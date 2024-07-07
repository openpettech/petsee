import { GenericEvent } from '@contracts/events';
import { SmsLog } from '@prisma/client';

export class SmsLogUpdatedEvent extends GenericEvent<SmsLog> {}
