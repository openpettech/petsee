import { GenericEvent } from '@contracts/events';
import { Note } from '@prisma/client';

export class NoteCreatedEvent extends GenericEvent<Note> {}
