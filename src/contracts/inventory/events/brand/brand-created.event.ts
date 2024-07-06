import { GenericEvent } from '@contracts/events';
import { Brand } from '@prisma/client';

export class BrandCreatedEvent extends GenericEvent<Brand> {}
