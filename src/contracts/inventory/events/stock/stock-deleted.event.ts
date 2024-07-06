import { GenericEvent } from '@contracts/events';
import { Stock } from '@prisma/client';

export class StockDeletedEvent extends GenericEvent<Stock> {}
