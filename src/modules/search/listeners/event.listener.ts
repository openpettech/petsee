import { Injectable, Inject, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { GenericEvent } from '@contracts/events';
import { SearchService } from '@modules/core';

@Injectable()
export class SearchEventListener {
  private readonly logger = new Logger(SearchEventListener.name);

  constructor(
    @Inject(SearchService) private readonly searchService: SearchService,
  ) {}

  @OnEvent('**')
  async handleAllEvents(event: GenericEvent<any>) {
    this.logger.debug(`Received event:`, JSON.stringify(event, null, 2));

    const id: string = event?.after?.id ?? event?.before?.id;
    const commonProps = {
      id,
      indexName: event.entity,
    };

    const entry = await this.searchService.getEntry(commonProps);

    if (!!entry) {
      this.logger.log(`Found ${event.entity} entry with id - ${id}`);
      await this.searchService.updateEntry({
        ...commonProps,
        data: event.after,
      });
      return;
    }

    this.logger.log(`Not found ${event.entity} entry with id - ${id}`);
    await this.searchService.createEntry({
      ...commonProps,
      data: event.after,
    });
  }
}
