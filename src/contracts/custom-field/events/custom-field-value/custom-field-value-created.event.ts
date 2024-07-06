import { GenericEvent } from '@contracts/events';
import { CustomFieldValue } from '@prisma/client';

export class CustomFieldValueCreatedEvent extends GenericEvent<CustomFieldValue> {}
