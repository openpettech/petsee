import { GenericEvent } from '@contracts/events';
import { Service } from '@prisma/client';

export class ServiceCreatedEvent extends GenericEvent<Service> {}
