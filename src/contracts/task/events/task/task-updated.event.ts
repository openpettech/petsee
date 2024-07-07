import { GenericEvent } from '@contracts/events';
import { Task } from '@prisma/client';

export class TaskUpdatedEvent extends GenericEvent<Task> {}
