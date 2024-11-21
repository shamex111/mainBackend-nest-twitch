import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IS_DEV_ENV } from './libs/common/utils/is-dev.util';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { MailModule } from './libs/mail/mail.module';
import { ProviderModule } from './auth/provider/provider.module';
import { EmailConfirmationModule } from './auth/email-confirmation/email-confirmation.module';
import { TwoFactorAuthModule } from './auth/two-factor-auth/two-factor-auth.module';
import { PasswordRecoveryModule } from './auth/password-recovery/password-recovery.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: !IS_DEV_ENV,
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    PrismaModule,
    MailModule,
    ProviderModule,
    EmailConfirmationModule,
    TwoFactorAuthModule,
    PasswordRecoveryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
