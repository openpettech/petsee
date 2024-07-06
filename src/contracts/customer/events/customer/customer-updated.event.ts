import { GenericEvent } from '@contracts/events';
import { Customer } from '@prisma/client';

export class CustomerUpdatedEvent extends GenericEvent<Customer> {}
