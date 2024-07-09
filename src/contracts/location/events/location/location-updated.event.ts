import { GenericEvent } from '@contracts/events';
import { Location } from '@prisma/client';

export class LocationUpdatedEvent extends GenericEvent<Location> {}
