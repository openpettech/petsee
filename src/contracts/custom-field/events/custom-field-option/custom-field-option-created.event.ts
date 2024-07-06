import { GenericEvent } from '@contracts/events';
import { CustomFieldOption } from '@prisma/client';

export class CustomFieldOptionCreatedEvent extends GenericEvent<CustomFieldOption> {}
