import {
  CreateSearchEntryDto,
  UpdateSearchEntryDto,
  DeleteSearchEntryDto,
  GetSearchEntryDto,
  GetSearchEntriesDto,
  SearchEntriesDto,
  SearchResultsDto,
} from '@contracts/core';

export abstract class SearchService<T = any> {
  abstract createEntry(params: CreateSearchEntryDto<T>): Promise<void>;
  abstract updateEntry(params: UpdateSearchEntryDto<T>): Promise<void>;
  abstract deleteEntry(params: DeleteSearchEntryDto): Promise<void>;
  abstract getEntry(params: GetSearchEntryDto): Promise<T | null>;
  abstract getEntries(params: GetSearchEntriesDto): Promise<T[]>;
  abstract search(params: SearchEntriesDto): Promise<SearchResultsDto<T>>;
}
