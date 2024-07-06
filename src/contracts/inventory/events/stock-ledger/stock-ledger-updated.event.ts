import { GenericEvent } from '@contracts/events';
import { StockLedger } from '@prisma/client';

export class StockLedgerUpdatedEvent extends GenericEvent<StockLedger> {}
