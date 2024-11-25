import { Module } from '@nestjs/common';
import { RewardService } from './reward.service';
import { RewardController } from './reward.controller';
import { UserModule } from 'src/user/user.module';
import { CurrencyService } from '../currency/currency.service';

@Module({
  controllers: [RewardController],
  providers: [RewardService,CurrencyService],
  imports: [UserModule],
})
export class RewardModule {}
