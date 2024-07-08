import { GenericEvent } from '@contracts/events';
import { DocumentTemplateField } from '@prisma/client';

export class DocumentTemplateFieldDeletedEvent extends GenericEvent<DocumentTemplateField> {}
