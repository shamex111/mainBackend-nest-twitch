import { Module } from '@nestjs/common';
import { EmailConfirmationService } from './email-confirmation.service';
import { EmailConfirmationController } from './email-confirmation.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/libs/mail/mail.service';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [EmailConfirmationController],
  providers: [EmailConfirmationService,PrismaService,MailService,UserService],
})
export class EmailConfirmationModule {}
