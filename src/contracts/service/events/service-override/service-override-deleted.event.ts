import { GenericEvent } from '@contracts/events';
import { ServiceOverride } from '@prisma/client';

export class ServiceOverrideDeletedEvent extends GenericEvent<ServiceOverride> {}
