import { GenericEvent } from '@contracts/events';
import { Product } from '@prisma/client';

export class ProductCreatedEvent extends GenericEvent<Product> {}
