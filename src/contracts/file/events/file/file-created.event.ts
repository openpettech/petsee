import { GenericEvent } from '@contracts/events';
import { File } from '@prisma/client';

export class FileCreatedEvent extends GenericEvent<File> {}
