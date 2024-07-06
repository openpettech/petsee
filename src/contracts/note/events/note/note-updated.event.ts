import { GenericEvent } from '@contracts/events';
import { Note } from '@prisma/client';

export class NoteUpdatedEvent extends GenericEvent<Note> {}
