import { GenericEvent } from '@contracts/events';
import { ApiKey } from '@prisma/client';

export class ApiKeyUpdatedEvent extends GenericEvent<ApiKey> {}
