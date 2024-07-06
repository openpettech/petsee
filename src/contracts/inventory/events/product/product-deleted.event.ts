import { GenericEvent } from '@contracts/events';
import { Product } from '@prisma/client';

export class ProductDeletedEvent extends GenericEvent<Product> {}
