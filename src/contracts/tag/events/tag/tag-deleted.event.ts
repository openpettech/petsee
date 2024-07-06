import { GenericEvent } from '@contracts/events';
import { Tag } from '@prisma/client';

export class TagDeletedEvent extends GenericEvent<Tag> {}
