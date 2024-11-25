import { Module } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CurrencyController } from './currency.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [CurrencyController],
  providers: [CurrencyService],
  imports: [UserModule],  
})
export class CurrencyModule {}
