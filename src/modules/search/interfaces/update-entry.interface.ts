export interface UpdateEntryParams<T = any> {
  indexName: string;
  id: string;
  data: T;
}
