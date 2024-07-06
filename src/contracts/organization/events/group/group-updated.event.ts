import { GenericEvent } from '@contracts/events';
import { Group } from '@prisma/client';

export class GroupUpdatedEvent extends GenericEvent<Group> {}
