import { ICache } from './cache.interface';
import { IDb } from './db.interface';
import { ISearch } from './search.interface';
import { IObjectStorage } from './object-storage.interface';
import { IAuth } from './auth.interface';
import { IMonitoring } from './monitoring.interface';

export interface IConfig {
  id: string;
  port: number;
  domain: string;
  db: IDb;
  cache: ICache;
  search: ISearch;
  objectStorage: IObjectStorage;
  auth: IAuth;
  monitoring: IMonitoring;
}
