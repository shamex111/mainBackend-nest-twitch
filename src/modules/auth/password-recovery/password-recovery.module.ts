import { forwardRef, Module } from '@nestjs/common';
import { PasswordRecoveryService } from './password-recovery.service';
import { PasswordRecoveryController } from './password-recovery.controller';
import { UserService } from 'src/modules/user/user.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { MailService } from 'src/modules/libs/mail/mail.service';
import { TwoFactorAuthModule } from '../two-factor-auth/two-factor-auth.module';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => TwoFactorAuthModule),
  ],
  controllers: [PasswordRecoveryController],
  providers: [PasswordRecoveryService, MailService, PrismaService, UserService],
})
export class PasswordRecoveryModule {}
