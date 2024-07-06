import { GenericEvent } from '@contracts/events';
import { Warehouse } from '@prisma/client';

export class WarehouseCreatedEvent extends GenericEvent<Warehouse> {}
