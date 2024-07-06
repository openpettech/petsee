import { GenericEvent } from '@contracts/events';
import { Breed } from '@prisma/client';

export class BreedEntryDeletedEvent extends GenericEvent<Breed> {}
