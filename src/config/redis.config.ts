import { ConfigService } from '@nestjs/config';
import { RedisModuleOptions } from '@liaoliaots/nestjs-redis';

export const getRedisConfig = async (
  configService: ConfigService,
): Promise<RedisModuleOptions> => ({
  config: [
    {
      namespace: 'sessions',  
      host: configService.getOrThrow<string>('REDIS_HOST'),
      port: configService.getOrThrow<number>('REDIS_PORT'),
      password: configService.getOrThrow<string>('REDIS_PASSWORD'),
      keyPrefix: configService.getOrThrow<string>('SESSION_PREFIX') || 'sessions:', 
    },
    {
      namespace: 'cache', 
      host: configService.getOrThrow<string>('REDIS_HOST'),
      port: configService.getOrThrow<number>('REDIS_PORT'),
      password: configService.getOrThrow<string>('REDIS_PASSWORD'),
      keyPrefix: configService.getOrThrow<string>('CACHE_PREFIX') || 'cache:',
    },
  ],
});
