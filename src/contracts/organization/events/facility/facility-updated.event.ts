import { GenericEvent } from '@contracts/events';
import { Facility } from '@prisma/client';

export class FacilityUpdatedEvent extends GenericEvent<Facility> {}
