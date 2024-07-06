import { GenericEvent } from '@contracts/events';
import { Facility } from '@prisma/client';

export class FacilityDeletedEvent extends GenericEvent<Facility> {}
