import { GenericEvent } from '@contracts/events';
import { Note } from '@prisma/client';

export class NoteDeletedEvent extends GenericEvent<Note> {}
