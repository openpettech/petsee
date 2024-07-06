import { GenericEvent } from '@contracts/events';
import { CustomField } from '@prisma/client';

export class CustomFieldDeletedEvent extends GenericEvent<CustomField> {}
