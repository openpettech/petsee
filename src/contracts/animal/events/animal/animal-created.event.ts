import { GenericEvent } from '@contracts/events';
import { Animal } from '@prisma/client';

export class AnimalCreatedEvent extends GenericEvent<Animal> {}
