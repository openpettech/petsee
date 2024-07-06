import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Readable } from 'stream';

import { GenericEvent } from '@contracts/events';
import { ObjectStorageService } from '@modules/core';

import { Context } from '@contracts/common';

@Injectable()
export class DataLakeEventListener {
  private readonly logger = new Logger(DataLakeEventListener.name);

  constructor(
    @Inject(ObjectStorageService)
    private readonly objectStorageService: ObjectStorageService,
  ) {}

  @OnEvent('**')
  async handleAllEvents(event: GenericEvent<any>) {
    this.logger.debug(`Received event:`, JSON.stringify(event, null, 2));

    const buffer = Buffer.from(JSON.stringify(event, null, 2));
    const stream = Readable.from(buffer);
    const name = `${new Date(
      event.timestamp,
    ).toISOString()}-${event.action}.json`;

    const path = `bronze-tier/${event.entity}/${event.entityId}`;

    const file = {
      stream,
      buffer,
      fieldname: 'file',
      filename: name,
      path: './',
      destination: './',
      originalname: name,
      encoding: 'utf8',
      mimetype: 'application/json',
      size: buffer.length,
    };

    await this.objectStorageService.store({} as Context, {
      file,
      path,
      useFilename: true,
      bucket: 'data-lake',
    });
  }
}
