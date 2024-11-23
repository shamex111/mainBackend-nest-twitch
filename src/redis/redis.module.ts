import { Module } from '@nestjs/common';
import { RedisModule as LiaoliaotsRedisModule } from '@liaoliaots/nestjs-redis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getRedisConfig } from '../config/redis.config';

@Module({
  imports: [
    LiaoliaotsRedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getRedisConfig,
      inject: [ConfigService],
    }),
  ],
  exports: [LiaoliaotsRedisModule],
})
export class RedisModule {}
