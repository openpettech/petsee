import { GenericEvent } from '@contracts/events';
import { Warehouse } from '@prisma/client';

export class WarehouseUpdatedEvent extends GenericEvent<Warehouse> {}
