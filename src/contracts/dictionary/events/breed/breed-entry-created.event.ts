import { GenericEvent } from '@contracts/events';
import { Breed } from '@prisma/client';

export class BreedEntryCreatedEvent extends GenericEvent<Breed> {}
