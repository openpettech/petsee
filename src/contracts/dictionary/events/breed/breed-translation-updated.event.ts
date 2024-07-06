import { GenericEvent } from '@contracts/events';
import { BreedTranslation } from '@prisma/client';

export class BreedTranslationUpdatedEvent extends GenericEvent<BreedTranslation> {}
