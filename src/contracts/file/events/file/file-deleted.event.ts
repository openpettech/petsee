import { GenericEvent } from '@contracts/events';
import { File } from '@prisma/client';

export class FileDeletedEvent extends GenericEvent<File> {}
