import { GenericEvent } from '@contracts/events';
import { MerchantAssociation } from '@prisma/client';

export class MerchantAssociationDeletedEvent extends GenericEvent<MerchantAssociation> {}
