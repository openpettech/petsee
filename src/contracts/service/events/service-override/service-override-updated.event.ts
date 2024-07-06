import { GenericEvent } from '@contracts/events';
import { ServiceOverride } from '@prisma/client';

export class ServiceOverrideUpdatedEvent extends GenericEvent<ServiceOverride> {}
