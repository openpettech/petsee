import { GenericEvent } from '@contracts/events';
import { Facility } from '@prisma/client';

export class FacilityCreatedEvent extends GenericEvent<Facility> {}
