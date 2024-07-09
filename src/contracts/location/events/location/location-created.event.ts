import { GenericEvent } from '@contracts/events';
import { Location } from '@prisma/client';

export class LocationCreatedEvent extends GenericEvent<Location> {}
