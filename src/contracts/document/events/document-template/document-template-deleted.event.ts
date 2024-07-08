import { GenericEvent } from '@contracts/events';
import { DocumentTemplate } from '@prisma/client';

export class DocumentTemplateDeletedEvent extends GenericEvent<DocumentTemplate> {}
