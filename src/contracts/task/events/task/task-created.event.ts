import { GenericEvent } from '@contracts/events';
import { Task } from '@prisma/client';

export class TaskCreatedEvent extends GenericEvent<Task> {}
