import { GenericEvent } from '@contracts/events';
import { StockLedger } from '@prisma/client';

export class StockLedgerCreatedEvent extends GenericEvent<StockLedger> {}
