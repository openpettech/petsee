interface IMeilisearch {
  host: string;
  apiKey: string;
}

export interface ISearch {
  provider?: string;

  meilisearch?: IMeilisearch;
}
