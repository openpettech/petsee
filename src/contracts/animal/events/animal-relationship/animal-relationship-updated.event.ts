import { GenericEvent } from '@contracts/events';
import { AnimalRelationship } from '@prisma/client';

export class AnimalRelationshipUpdatedEvent extends GenericEvent<AnimalRelationship> {}
