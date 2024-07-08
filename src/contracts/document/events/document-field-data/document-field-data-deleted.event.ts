import { GenericEvent } from '@contracts/events';
import { DocumentFieldData } from '@prisma/client';

export class DocumentFieldDataDeletedEvent extends GenericEvent<DocumentFieldData> {}
