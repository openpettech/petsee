import { GenericEvent } from '@contracts/events';
import { Stock } from '@prisma/client';

export class StockUpdatedEvent extends GenericEvent<Stock> {}
