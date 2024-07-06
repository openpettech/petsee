import { GenericEvent } from '@contracts/events';
import { Tag } from '@prisma/client';

export class TagCreatedEvent extends GenericEvent<Tag> {}
