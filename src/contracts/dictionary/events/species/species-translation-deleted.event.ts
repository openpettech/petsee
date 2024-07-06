import { GenericEvent } from '@contracts/events';
import { SpeciesTranslation } from '@prisma/client';

export class SpeciesTranslationDeletedEvent extends GenericEvent<SpeciesTranslation> {}
