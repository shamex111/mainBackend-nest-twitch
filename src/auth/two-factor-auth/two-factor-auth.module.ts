import { Module, forwardRef } from '@nestjs/common';
import { TwoFactorAuthService } from './two-factor-auth.service';
import { MailService } from 'src/libs/mail/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { TwoFactorAuthController } from './two-factor-auth.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
  ],
  controllers: [TwoFactorAuthController],
  providers: [TwoFactorAuthService, MailService],
  exports: [TwoFactorAuthService], 
})
export class TwoFactorAuthModule {}
