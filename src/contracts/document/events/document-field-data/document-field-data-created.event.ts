import { GenericEvent } from '@contracts/events';
import { DocumentFieldData } from '@prisma/client';

export class DocumentFieldDataCreatedEvent extends GenericEvent<DocumentFieldData> {}
