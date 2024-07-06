import { GenericEvent } from '@contracts/events';
import { ApiKey } from '@prisma/client';

export class ApiKeyCreatedEvent extends GenericEvent<ApiKey> {}
