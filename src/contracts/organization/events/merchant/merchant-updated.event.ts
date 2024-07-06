import { GenericEvent } from '@contracts/events';
import { Merchant } from '@prisma/client';

export class MerchantUpdatedEvent extends GenericEvent<Merchant> {}
