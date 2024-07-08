import { GenericEvent } from '@contracts/events';
import { Resource } from '@prisma/client';

export class ResourceCreatedEvent extends GenericEvent<Resource> {}
