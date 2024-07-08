import { GenericEvent } from '@contracts/events';
import { ResourceType } from '@prisma/client';

export class ResourceTypeDeletedEvent extends GenericEvent<ResourceType> {}
