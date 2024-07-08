import { GenericEvent } from '@contracts/events';
import { DocumentTemplate } from '@prisma/client';

export class DocumentTemplateCreatedEvent extends GenericEvent<DocumentTemplate> {}
