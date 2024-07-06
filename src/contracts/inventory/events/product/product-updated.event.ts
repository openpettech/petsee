import { GenericEvent } from '@contracts/events';
import { Product } from '@prisma/client';

export class ProductUpdatedEvent extends GenericEvent<Product> {}
