import { GenericEvent } from '@contracts/events';
import { Supplier } from '@prisma/client';

export class SupplierUpdatedEvent extends GenericEvent<Supplier> {}
