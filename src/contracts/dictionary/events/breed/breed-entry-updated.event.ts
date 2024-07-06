import { GenericEvent } from '@contracts/events';
import { Breed } from '@prisma/client';

export class BreedEntryUpdatedEvent extends GenericEvent<Breed> {}
