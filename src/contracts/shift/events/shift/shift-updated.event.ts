import { GenericEvent } from '@contracts/events';
import { Shift } from '@prisma/client';

export class ShiftUpdatedEvent extends GenericEvent<Shift> {}
