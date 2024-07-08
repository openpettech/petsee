import { GenericEvent } from '@contracts/events';
import { Document } from '@prisma/client';

export class DocumentDeletedEvent extends GenericEvent<Document> {}
