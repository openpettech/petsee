import { GenericEvent } from '@contracts/events';
import { DocumentTemplateFieldOption } from '@prisma/client';

export class DocumentTemplateFieldOptionDeletedEvent extends GenericEvent<DocumentTemplateFieldOption> {}
