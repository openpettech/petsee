import { GenericEvent } from '@contracts/events';
import { Service } from '@prisma/client';

export class ServiceDeletedEvent extends GenericEvent<Service> {}
