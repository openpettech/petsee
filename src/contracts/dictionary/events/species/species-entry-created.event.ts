import { GenericEvent } from '@contracts/events';
import { Species } from '@prisma/client';

export class SpeciesEntryCreatedEvent extends GenericEvent<Species> {}
