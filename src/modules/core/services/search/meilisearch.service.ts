import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MeiliSearch } from 'meilisearch';

import {
  CreateSearchEntryDto,
  UpdateSearchEntryDto,
  DeleteSearchEntryDto,
  GetSearchEntryDto,
  GetSearchEntriesDto,
  SearchEntriesDto,
  SearchResultsDto,
  SearchMetaDto,
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

  private async before(indexName: string, entry?: T) {
    const index = this.getIndexName(indexName);

    try {
      await this.client.getIndex(index);
    } catch (err) {
      this.logger.log(`Index ${indexName} does not exists - creating one...`);
      await this.client.createIndex(index);
      this.logger.log(`Index ${indexName} created`);

      // Meilisearch bug on creating index
      const defaultDocumentId = 'INITIAL';
      const clientIndex = this.client.index(index);

      if (entry) {
        clientIndex.updateSettings({
          filterableAttributes: Object.keys(entry),
          sortableAttributes: Object.keys(entry),
        });
      }
      await clientIndex.addDocuments([
        {
          id: defaultDocumentId,
        },
      ]);
      await this.client.index(index).deleteDocument(defaultDocumentId);
    }
  }

  async createEntry({ indexName, data }: CreateSearchEntryDto) {
    try {
      await this.before(indexName, data);
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
      await this.before(indexName, { id, ...data });
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

  async search({
    indexName,
    projectId,
    query,
    limit = 10,
    offset = 0,
  }: SearchEntriesDto): Promise<SearchResultsDto<T>> {
    try {
      const index = this.getIndexName(indexName);
      const searchIndex = this.client.index(index);
      const parsedQuery = this.parseQuery(query, projectId);

      const searchResults = await searchIndex.search<T>(parsedQuery.q, {
        filter: parsedQuery.filter,
        limit,
        offset,
      });

      const items = searchResults.hits as T[];

      const meta = new SearchMetaDto({
        limit,
        page: searchResults.page ?? 1,
        total: searchResults.totalHits ?? 0,
        pageCount: searchResults.totalPages ?? 1,
      });

      return new SearchResultsDto<T>(items, meta);
    } catch (err) {
      console.log(err);
      this.logger.error(
        `Error while fetching ${indexName} entries: ${err.name}`,
      );
    }
  }

  parseQuery(query: string, projectId: string) {
    const operators = ['>=', '<=', '>', '<', '='];
    const logicalOperators = ['AND', 'OR'];
    const filters: string[] = [`projectId = "${projectId}"`];
    const queryTerms: string[] = [];

    // Tokenize the query by spaces while considering quotes
    const tokens = query.match(/(?:[^\s"]+|"[^"]*")+/g) || [];

    tokens.forEach((token) => {
      // Remove quotes from tokens
      token = token.replace(/"/g, '');

      if (logicalOperators.includes(token)) {
        filters.push(token);
      } else if (operators.some((op) => token.includes(op))) {
        filters.push(token);
      } else if (token.startsWith('-')) {
        const [field, value] = token.substring(1).split(':');
        filters.push(`${field} != "${value}"`);
      } else if (token.includes(':')) {
        const [field, value] = token.split(':');
        filters.push(`${field} = "${value}"`);
      } else {
        queryTerms.push(token);
      }
    });

    return {
      q: queryTerms.join(' AND '),
      filter: filters.join(' AND '),
    };
  }
}
