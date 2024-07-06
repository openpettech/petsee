import { GenericEvent } from '@contracts/events';
import { Supplier } from '@prisma/client';

export class SupplierDeletedEvent extends GenericEvent<Supplier> {}
