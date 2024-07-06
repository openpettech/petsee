import { GenericEvent } from '@contracts/events';
import { Project } from '@prisma/client';

export class ProjectCreatedEvent extends GenericEvent<Project> {}
