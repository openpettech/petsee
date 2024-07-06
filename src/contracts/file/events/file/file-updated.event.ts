import { GenericEvent } from '@contracts/events';
import { File } from '@prisma/client';

export class FileUpdatedEvent extends GenericEvent<File> {}
