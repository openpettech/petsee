import { GenericEvent } from '@contracts/events';
import { CustomFieldValue } from '@prisma/client';

export class CustomFieldValueDeletedEvent extends GenericEvent<CustomFieldValue> {}
