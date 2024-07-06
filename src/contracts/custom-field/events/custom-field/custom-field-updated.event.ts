import { GenericEvent } from '@contracts/events';
import { CustomField } from '@prisma/client';

export class CustomFieldUpdatedEvent extends GenericEvent<CustomField> {}
