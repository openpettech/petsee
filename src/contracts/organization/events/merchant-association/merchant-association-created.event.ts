import { GenericEvent } from '@contracts/events';
import { MerchantAssociation } from '@prisma/client';

export class MerchantAssociationCreatedEvent extends GenericEvent<MerchantAssociation> {}
