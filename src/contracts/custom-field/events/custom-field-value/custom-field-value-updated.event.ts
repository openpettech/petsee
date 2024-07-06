import { GenericEvent } from '@contracts/events';
import { CustomFieldValue } from '@prisma/client';

export class CustomFieldValueUpdatedEvent extends GenericEvent<CustomFieldValue> {}
