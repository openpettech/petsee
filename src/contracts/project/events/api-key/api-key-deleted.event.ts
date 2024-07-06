import { GenericEvent } from '@contracts/events';
import { ApiKey } from '@prisma/client';

export class ApiKeyDeletedEvent extends GenericEvent<ApiKey> {}
