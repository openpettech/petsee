import { GenericEvent } from '@contracts/events';
import { ServiceOverride } from '@prisma/client';

export class ServiceOverrideCreatedEvent extends GenericEvent<ServiceOverride> {}
