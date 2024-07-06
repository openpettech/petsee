import { GenericEvent } from '@contracts/events';
import { Project } from '@prisma/client';

export class ProjectUpdatedEvent extends GenericEvent<Project> {}
