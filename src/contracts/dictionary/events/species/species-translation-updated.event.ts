import { GenericEvent } from '@contracts/events';
import { SpeciesTranslation } from '@prisma/client';

export class SpeciesTranslationUpdatedEvent extends GenericEvent<SpeciesTranslation> {}
