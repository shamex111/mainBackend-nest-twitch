import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/modules/user/user.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProviderModule } from './provider/provider.module';
import { getProvidersConfig } from 'src/core/config/providers.config';
import { getRecaptchaConfig } from 'src/core/config/recaptcha.config';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';
import { EmailConfirmationService } from './email-confirmation/email-confirmation.service';
import { TwoFactorAuthService } from './two-factor-auth/two-factor-auth.service';
import { MailService } from 'src/modules/libs/mail/mail.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    MailService,
    TwoFactorAuthService,
    EmailConfirmationService,
    ConfigService,
  ],
  imports: [
    ConfigModule,
    ProviderModule.registerAsync({
      imports: [ConfigModule],
      useFactory: getProvidersConfig,
      inject: [ConfigService],
    }),
    GoogleRecaptchaModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getRecaptchaConfig,
      inject: [ConfigService],
    }),
  ],
  exports: [AuthService],
})
export class AuthModule {}
