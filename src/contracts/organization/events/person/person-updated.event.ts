import { GenericEvent } from '@contracts/events';
import { Person } from '@prisma/client';

export class PersonUpdatedEvent extends GenericEvent<Person> {}
