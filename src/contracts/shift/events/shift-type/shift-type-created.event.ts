import { GenericEvent } from '@contracts/events';
import { ShiftType } from '@prisma/client';

export class ShiftTypeCreatedEvent extends GenericEvent<ShiftType> {}
