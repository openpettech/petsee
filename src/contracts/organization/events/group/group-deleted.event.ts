import { GenericEvent } from '@contracts/events';
import { Group } from '@prisma/client';

export class GroupDeletedEvent extends GenericEvent<Group> {}
