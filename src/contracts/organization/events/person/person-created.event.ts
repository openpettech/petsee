import { GenericEvent } from '@contracts/events';
import { Person } from '@prisma/client';

export class PersonCreatedEvent extends GenericEvent<Person> {}
