import { GenericEvent } from '@contracts/events';
import { Shift } from '@prisma/client';

export class ShiftCreatedEvent extends GenericEvent<Shift> {}
