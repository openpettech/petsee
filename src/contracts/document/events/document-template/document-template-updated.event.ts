import { GenericEvent } from '@contracts/events';
import { DocumentTemplate } from '@prisma/client';

export class DocumentTemplateUpdatedEvent extends GenericEvent<DocumentTemplate> {}
