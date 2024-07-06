import { GenericEvent } from '@contracts/events';
import { Animal } from '@prisma/client';

export class AnimalDeletedEvent extends GenericEvent<Animal> {}
