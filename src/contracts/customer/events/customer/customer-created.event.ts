import { GenericEvent } from '@contracts/events';
import { Customer } from '@prisma/client';

export class CustomerCreatedEvent extends GenericEvent<Customer> {}
