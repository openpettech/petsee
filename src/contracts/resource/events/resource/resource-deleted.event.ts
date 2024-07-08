import { GenericEvent } from '@contracts/events';
import { Resource } from '@prisma/client';

export class ResourceDeletedEvent extends GenericEvent<Resource> {}
