import { GenericEvent } from '@contracts/events';
import { Group } from '@prisma/client';

export class GroupCreatedEvent extends GenericEvent<Group> {}
