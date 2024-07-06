import { GenericEvent } from '@contracts/events';
import { Warehouse } from '@prisma/client';

export class WarehouseDeletedEvent extends GenericEvent<Warehouse> {}
