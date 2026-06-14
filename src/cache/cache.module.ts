import { Module } from '@nestjs/common';
import { createKeyv } from '@keyv/redis';
import { Cacheable } from 'cacheable';
import { CacheService } from './cache.service';

@Module({
  providers: [
    {
      provide: 'CACHE_INSTANCE',
      useFactory: () => {
        const secondary = createKeyv(process.env.REDIS_DB, {
          namespace: 'keyv',
        });
        return new Cacheable({ secondary, ttl: '4h' });
      },
    },
    CacheService,
  ],
  exports: ['CACHE_INSTANCE', CacheService],
})
export class CacheModule {}
