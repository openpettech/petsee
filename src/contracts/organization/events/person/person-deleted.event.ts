import { GenericEvent } from '@contracts/events';
import { Person } from '@prisma/client';

export class PersonDeletedEvent extends GenericEvent<Person> {}
