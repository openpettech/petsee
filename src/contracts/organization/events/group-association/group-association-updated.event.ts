import { GenericEvent } from '@contracts/events';
import { GroupAssociation } from '@prisma/client';

export class GroupAssociationUpdatedEvent extends GenericEvent<GroupAssociation> {}
