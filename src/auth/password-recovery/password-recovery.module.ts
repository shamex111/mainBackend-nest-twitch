import { Module } from '@nestjs/common';
import { PasswordRecoveryService } from './password-recovery.service';
import { PasswordRecoveryController } from './password-recovery.controller';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/libs/mail/mail.service';

@Module({
  controllers: [PasswordRecoveryController],
  providers: [PasswordRecoveryService,MailService,PrismaService,UserService],
})
export class PasswordRecoveryModule {}
