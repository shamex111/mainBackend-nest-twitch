import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { YookassaModule } from 'nestjs-yookassa';
import { getYooKassaConfig } from 'src/core/config/yooKassa.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from 'src/modules/user/user.module';
@Module({
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  imports: [
    YookassaModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getYooKassaConfig,
      inject: [ConfigService],
    }),
    UserModule,
  ],
})
export class SubscriptionModule {}
