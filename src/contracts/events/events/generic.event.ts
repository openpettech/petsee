import { EventAction } from '../enums';

export class GenericEvent<T = any> {
  eventName: string;
  projectId?: string;
  before?: T;
  after?: T;
  action: EventAction;
  entity: string;
  entityId: string;
  timestamp: Date;
}
