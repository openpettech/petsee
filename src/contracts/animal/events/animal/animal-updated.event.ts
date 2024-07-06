import { GenericEvent } from '@contracts/events';
import { Animal } from '@prisma/client';

export class AnimalUpdatedEvent extends GenericEvent<Animal> {}
