import { GenericEvent } from '@contracts/events';
import { Stock } from '@prisma/client';

export class StockCreatedEvent extends GenericEvent<Stock> {}
