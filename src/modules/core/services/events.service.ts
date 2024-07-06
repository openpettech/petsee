import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { EmitEventDto } from '@contracts/events';

@Injectable()
export class EventsService<T = any> {
  private readonly logger = new Logger(EventsService.name);

  constructor(private readonly eventEmitter: EventEmitter2) {}

  emitEvent({
    entity,
    entityId,
    event,
    action,
    before,
    after,
    eventName,
    projectId,
  }: EmitEventDto<T>) {
    event.eventName = eventName;
    event.projectId = projectId;
    event.action = action;
    event.before = before;
    event.after = after;
    event.entity = entity;
    event.entityId = entityId;
    event.timestamp = new Date();

    this.eventEmitter.emit(eventName, event);
  }
}
