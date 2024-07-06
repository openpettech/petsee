import { GenericEvent } from '@contracts/events';
import { Species } from '@prisma/client';

export class SpeciesEntryDeletedEvent extends GenericEvent<Species> {}
