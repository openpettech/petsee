import { GenericEvent } from '@contracts/events';
import { DocumentFieldData } from '@prisma/client';

export class DocumentFieldDataUpdatedEvent extends GenericEvent<DocumentFieldData> {}
