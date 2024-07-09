import { GenericEvent } from '@contracts/events';
import { Location } from '@prisma/client';

export class LocationDeletedEvent extends GenericEvent<Location> {}
