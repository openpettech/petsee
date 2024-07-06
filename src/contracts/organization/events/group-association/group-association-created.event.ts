import { GenericEvent } from '@contracts/events';
import { GroupAssociation } from '@prisma/client';

export class GroupAssociationCreatedEvent extends GenericEvent<GroupAssociation> {}
