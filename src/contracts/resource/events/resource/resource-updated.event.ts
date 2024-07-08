import { GenericEvent } from '@contracts/events';
import { Resource } from '@prisma/client';

export class ResourceUpdatedEvent extends GenericEvent<Resource> {}
