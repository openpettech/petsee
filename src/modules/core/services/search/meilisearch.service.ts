import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MeiliSearch } from 'meilisearch';

import {
  CreateSearchEntryDto,
  UpdateSearchEntryDto,
  DeleteSearchEntryDto,
  GetSearchEntryDto,
  GetSearchEntriesDto,
} from '@contracts/core';

import { SearchService } from './search.service';

@Injectable()
export class MeilisearchService<T = any> extends SearchService {
  private readonly logger = new Logger(MeilisearchService.name);
  private readonly client: MeiliSearch;

  constructor(private readonly configService: ConfigService) {
    super();

    this.client = new MeiliSearch({
      host: configService.get('search.meilisearch.host'),
      apiKey: configService.get('search.meilisearch.apiKey'),
    });
  }

  private getIndexName(indexName: string): string {
    return indexName.replace('.', '_').toLowerCase();
  }

  private async before(indexName: string) {
    const index = this.getIndexName(indexName);

    try {
      await this.client.getIndex(index);
    } catch (err) {
      this.logger.log(`Index ${indexName} does not exists - creating one...`);
      await this.client.createIndex(index);
      this.logger.log(`Index ${indexName} created`);

      // Meilisearch bug on creating index
      const defaultDocumentId = 'INITIAL';
      await this.client.index(index).addDocuments([
        {
          id: defaultDocumentId,
        },
      ]);
      await this.client.index(index).deleteDocument(defaultDocumentId);
    }
  }

  async createEntry({ indexName, data }: CreateSearchEntryDto) {
    try {
      await this.before(indexName);
      await this.client
        .index(this.getIndexName(indexName))
        .addDocuments([data]);
      this.logger.log(`Created ${indexName} entry with id - ${data?.id}`);
    } catch (err) {
      this.logger.error(
        `Error while creating ${indexName} entry with id - ${data?.id}: ${err.name}`,
      );
    }
  }

  async updateEntry({ indexName, id, data }: UpdateSearchEntryDto) {
    try {
      await this.before(indexName);
      await this.client.index(this.getIndexName(indexName)).updateDocuments([
        {
          id,
          ...data,
        },
      ]);
      this.logger.log(`Updated ${indexName} entry with id - ${id}`);
    } catch (err) {
      this.logger.error(
        `Error while updating ${indexName} entry with id - ${id}: ${err.name}`,
      );
    }
  }

  async deleteEntry({ indexName, id }: DeleteSearchEntryDto) {
    try {
      await this.before(indexName);
      await this.client.index(this.getIndexName(indexName)).deleteDocument(id);
      this.logger.log(`Deleted ${indexName} entry with id - ${id}`);
    } catch (err) {
      this.logger.error(
        `Error while deleting ${indexName} entry with id - ${id}: ${err.name}`,
      );
    }
  }

  async getEntry({ indexName, id }: GetSearchEntryDto): Promise<T | null> {
    try {
      await this.before(indexName);
      const entry = await this.client
        .index(this.getIndexName(indexName))
        .getDocument<T>(id);

      return entry;
    } catch (err) {
      return null;
    }
  }

  async getEntries({ indexName }: GetSearchEntriesDto): Promise<T[]> {
    try {
      await this.before(indexName);
      const { results } = await this.client
        .index(this.getIndexName(indexName))
        .getDocuments<T>();
      return results;
    } catch (err) {
      this.logger.error(
        `Error while fetchng ${indexName} entries: ${err.name}`,
      );
    }
  }
}
