import { GenericEvent } from '@contracts/events';
import { Document } from '@prisma/client';

export class DocumentUpdatedEvent extends GenericEvent<Document> {}
