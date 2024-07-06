import { GenericEvent } from '@contracts/events';
import { Service } from '@prisma/client';

export class ServiceUpdatedEvent extends GenericEvent<Service> {}
