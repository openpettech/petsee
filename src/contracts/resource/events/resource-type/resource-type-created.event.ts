import { GenericEvent } from '@contracts/events';
import { ResourceType } from '@prisma/client';

export class ResourceTypeCreatedEvent extends GenericEvent<ResourceType> {}
