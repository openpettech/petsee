import { GenericEvent } from '@contracts/events';
import { GroupAssociation } from '@prisma/client';

export class GroupAssociationDeletedEvent extends GenericEvent<GroupAssociation> {}
