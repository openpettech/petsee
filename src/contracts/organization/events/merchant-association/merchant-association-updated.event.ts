import { GenericEvent } from '@contracts/events';
import { MerchantAssociation } from '@prisma/client';

export class MerchantAssociationUpdatedEvent extends GenericEvent<MerchantAssociation> {}
