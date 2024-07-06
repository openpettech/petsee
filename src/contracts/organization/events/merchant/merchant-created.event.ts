import { GenericEvent } from '@contracts/events';
import { Merchant } from '@prisma/client';

export class MerchantCreatedEvent extends GenericEvent<Merchant> {}
