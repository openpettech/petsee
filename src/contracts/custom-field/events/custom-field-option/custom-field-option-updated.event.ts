import { GenericEvent } from '@contracts/events';
import { CustomFieldOption } from '@prisma/client';

export class CustomFieldOptionUpdatedEvent extends GenericEvent<CustomFieldOption> {}
