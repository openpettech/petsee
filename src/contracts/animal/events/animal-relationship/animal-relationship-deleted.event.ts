import { GenericEvent } from '@contracts/events';
import { AnimalRelationship } from '@prisma/client';

export class AnimalRelationshipDeletedEvent extends GenericEvent<AnimalRelationship> {}
