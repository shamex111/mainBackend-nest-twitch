import { Module } from '@nestjs/common';
import { TwoFactorAuthService } from './two-factor-auth.service';
import { MailService } from 'src/libs/mail/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Module({
  providers: [TwoFactorAuthService,MailService,PrismaService,UserService],
})
export class TwoFactorAuthModule {}
