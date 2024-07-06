import { GenericEvent } from '@contracts/events';
import { CustomField } from '@prisma/client';

export class CustomFieldCreatedEvent extends GenericEvent<CustomField> {}
