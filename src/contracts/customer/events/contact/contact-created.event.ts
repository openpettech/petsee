import { GenericEvent } from '@contracts/events';
import { Contact } from '@prisma/client';

export class ContactCreatedEvent extends GenericEvent<Contact> {}
