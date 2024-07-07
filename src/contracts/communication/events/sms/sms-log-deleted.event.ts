import { GenericEvent } from '@contracts/events';
import { SmsLog } from '@prisma/client';

export class SmsLogDeletedEvent extends GenericEvent<SmsLog> {}
