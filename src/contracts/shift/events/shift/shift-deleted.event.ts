import { GenericEvent } from '@contracts/events';
import { Shift } from '@prisma/client';

export class ShiftDeletedEvent extends GenericEvent<Shift> {}
