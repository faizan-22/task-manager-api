import { Inject, Injectable } from '@nestjs/common';
import { Cacheable } from 'cacheable';

@Injectable()
export class CacheService {
  constructor(
    @Inject('CACHE_INSTANCE') private readonly cacheable: Cacheable,
  ) {}

  async get(key: string) {
    return await this.cacheable.get(key);
  }

  async set<T>(key: string, value: T, ttl?: number | string) {
    return this.cacheable.set(key, value, ttl);
  }

  async del(key: string) {
    return this.cacheable.delete(key);
  }
}
