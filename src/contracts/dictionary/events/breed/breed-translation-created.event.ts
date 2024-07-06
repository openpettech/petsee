import { GenericEvent } from '@contracts/events';
import { BreedTranslation } from '@prisma/client';

export class BreedTranslationCreatedEvent extends GenericEvent<BreedTranslation> {}
