import { GenericEvent } from '@contracts/events';
import { Supplier } from '@prisma/client';

export class SupplierCreatedEvent extends GenericEvent<Supplier> {}
