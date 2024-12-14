import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  controllers: [SessionController],
  providers: [SessionService],
  imports: [UserModule],
})
export class SessionModule {}
