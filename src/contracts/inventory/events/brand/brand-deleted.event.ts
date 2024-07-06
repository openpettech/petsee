import { GenericEvent } from '@contracts/events';
import { Brand } from '@prisma/client';

export class BrandDeletedEvent extends GenericEvent<Brand> {}
