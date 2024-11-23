import { forwardRef, Module } from '@nestjs/common';
import { EmailChangeService } from './email-change.service';
import { EmailChangeController } from './email-change.controller';
import { MailService } from 'src/libs/mail/mail.service';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { TwoFactorAuthModule } from '../two-factor-auth/two-factor-auth.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => TwoFactorAuthModule), 
  ],
  controllers: [EmailChangeController],
  providers: [EmailChangeService,MailService,UserService],
})
export class EmailChangeModule {}
