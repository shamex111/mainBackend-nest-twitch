import { Module, forwardRef } from '@nestjs/common';
import { TwoFactorAuthService } from './two-factor-auth.service';
import { MailService } from 'src/modules/libs/mail/mail.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { TwoFactorAuthController } from './two-factor-auth.controller';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  imports: [forwardRef(() => UserModule),],
  controllers: [TwoFactorAuthController],
  providers: [TwoFactorAuthService, MailService],
  exports: [TwoFactorAuthService],
})
export class TwoFactorAuthModule {}
