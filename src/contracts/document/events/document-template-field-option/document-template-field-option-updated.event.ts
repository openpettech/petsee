import { GenericEvent } from '@contracts/events';
import { DocumentTemplateFieldOption } from '@prisma/client';

export class DocumentTemplateFieldOptionUpdatedEvent extends GenericEvent<DocumentTemplateFieldOption> {}
