interface IMinio {
  endpoint: string;
  port: number;
  ssl: boolean;
  accessKey: string;
  secretKey: string;
}

export interface IObjectStorage {
  provider: string;
  domain: string;

  minio?: IMinio;
}
