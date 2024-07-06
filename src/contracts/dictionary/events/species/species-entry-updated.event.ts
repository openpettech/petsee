import { GenericEvent } from '@contracts/events';
import { Species } from '@prisma/client';

export class SpeciesEntryUpdatedEvent extends GenericEvent<Species> {}
