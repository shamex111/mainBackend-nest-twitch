import { forwardRef, Module } from '@nestjs/common';
import { EmailConfirmationService } from './email-confirmation.service';
import { EmailConfirmationController } from './email-confirmation.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/libs/mail/mail.service';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { TwoFactorAuthModule } from '../two-factor-auth/two-factor-auth.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => TwoFactorAuthModule), 
  ],
  controllers: [EmailConfirmationController],
  providers: [EmailConfirmationService,MailService,UserService],
  exports:[EmailConfirmationService]
})
export class EmailConfirmationModule {}
