import { GenericEvent } from '@contracts/events';
import { ResourceType } from '@prisma/client';

export class ResourceTypeUpdatedEvent extends GenericEvent<ResourceType> {}
