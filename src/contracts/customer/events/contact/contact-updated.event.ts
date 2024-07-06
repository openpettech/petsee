import { GenericEvent } from '@contracts/events';
import { Contact } from '@prisma/client';

export class ContactUpdatedEvent extends GenericEvent<Contact> {}
