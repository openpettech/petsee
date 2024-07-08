import { GenericEvent } from '@contracts/events';
import { Document } from '@prisma/client';

export class DocumentCreatedEvent extends GenericEvent<Document> {}
