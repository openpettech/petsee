import { GenericEvent } from '@contracts/events';
import { ShiftType } from '@prisma/client';

export class ShiftTypeDeletedEvent extends GenericEvent<ShiftType> {}
