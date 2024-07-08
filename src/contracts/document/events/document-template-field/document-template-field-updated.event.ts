import { GenericEvent } from '@contracts/events';
import { DocumentTemplateField } from '@prisma/client';

export class DocumentTemplateFieldUpdatedEvent extends GenericEvent<DocumentTemplateField> {}
