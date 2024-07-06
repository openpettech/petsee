import { GenericEvent } from '@contracts/events';
import { StockLedger } from '@prisma/client';

export class StockLedgerDeletedEvent extends GenericEvent<StockLedger> {}
