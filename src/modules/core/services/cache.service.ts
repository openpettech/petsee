import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService<T = any> {
  private readonly logger = new Logger(CacheService.name);
  private readonly DEFAULT_TTL = 300000; // 5min

  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  async get(key: string) {
    const cachedData = await this.cache.get<T>(key);
    if (cachedData) {
      this.logger.debug(`${key} found in cache`);
      return cachedData;
    }

    return null;
  }

  async set(key: string, value: T, ttl: number = this.DEFAULT_TTL) {
    await this.cache.set(key, value, ttl);
    this.logger.debug(`${key} updated in cache`);
  }

  async del(key: string) {
    await this.cache.del(key);
    this.logger.debug(`${key} deleted from cache`);
  }
}
