import { GenericEvent } from '@contracts/events';
import { Contact } from '@prisma/client';

export class ContactDeletedEvent extends GenericEvent<Contact> {}
