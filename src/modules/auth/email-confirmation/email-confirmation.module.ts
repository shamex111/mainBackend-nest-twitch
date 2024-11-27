import { forwardRef, Module } from '@nestjs/common';
import { EmailConfirmationService } from './email-confirmation.service';
import { EmailConfirmationController } from './email-confirmation.controller';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { MailService } from 'src/modules/libs/mail/mail.service';
import { UserService } from 'src/modules/user/user.service';
import { UserModule } from 'src/modules/user/user.module';
import { TwoFactorAuthModule } from '../two-factor-auth/two-factor-auth.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => TwoFactorAuthModule),
    
  ],
  controllers: [EmailConfirmationController],
  providers: [EmailConfirmationService, MailService, UserService],
  exports: [EmailConfirmationService],
})
export class EmailConfirmationModule {}
