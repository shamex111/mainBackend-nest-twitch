import { forwardRef, Module } from '@nestjs/common';
import { PasswordRecoveryService } from './password-recovery.service';
import { PasswordRecoveryController } from './password-recovery.controller';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/libs/mail/mail.service';
import { TwoFactorAuthModule } from '../two-factor-auth/two-factor-auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => TwoFactorAuthModule),
  ],
  controllers: [PasswordRecoveryController],
  providers: [PasswordRecoveryService,MailService,PrismaService,UserService],
})
export class PasswordRecoveryModule {}
