import { GenericEvent } from '@contracts/events';
import { ShiftType } from '@prisma/client';

export class ShiftTypeUpdatedEvent extends GenericEvent<ShiftType> {}
