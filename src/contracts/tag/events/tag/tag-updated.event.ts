import { GenericEvent } from '@contracts/events';
import { Tag } from '@prisma/client';

export class TagUpdatedEvent extends GenericEvent<Tag> {}
