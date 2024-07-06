import { GenericEvent } from '@contracts/events';
import { AnimalRelationship } from '@prisma/client';

export class AnimalRelationshipCreatedEvent extends GenericEvent<AnimalRelationship> {}
