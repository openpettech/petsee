import { GenericEvent } from '@contracts/events';
import { Task } from '@prisma/client';

export class TaskDeletedEvent extends GenericEvent<Task> {}
