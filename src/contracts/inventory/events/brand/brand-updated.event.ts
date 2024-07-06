import { GenericEvent } from '@contracts/events';
import { Brand } from '@prisma/client';

export class BrandUpdatedEvent extends GenericEvent<Brand> {}
