import { GenericEvent } from '@contracts/events';
import { Project } from '@prisma/client';

export class ProjectDeletedEvent extends GenericEvent<Project> {}
