import { GenericEvent } from '@contracts/events';
import { Customer } from '@prisma/client';

export class CustomerDeletedEvent extends GenericEvent<Customer> {}
