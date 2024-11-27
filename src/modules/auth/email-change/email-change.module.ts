import { forwardRef, Module } from '@nestjs/common';
import { EmailChangeService } from './email-change.service';
import { EmailChangeController } from './email-change.controller';
import { MailService } from 'src/modules/libs/mail/mail.service';
import { UserService } from 'src/modules/user/user.service';
import { UserModule } from 'src/modules/user/user.module';
import { TwoFactorAuthModule } from '../two-factor-auth/two-factor-auth.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => TwoFactorAuthModule),
    
  ],
  controllers: [EmailChangeController],
  providers: [EmailChangeService, MailService, UserService],
})
export class EmailChangeModule {}
