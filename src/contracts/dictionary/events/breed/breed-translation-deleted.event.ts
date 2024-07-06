import { GenericEvent } from '@contracts/events';
import { BreedTranslation } from '@prisma/client';

export class BreedTranslationDeletedEvent extends GenericEvent<BreedTranslation> {}
