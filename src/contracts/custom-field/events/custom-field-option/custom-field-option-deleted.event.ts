import { GenericEvent } from '@contracts/events';
import { CustomFieldOption } from '@prisma/client';

export class CustomFieldOptionDeletedEvent extends GenericEvent<CustomFieldOption> {}
