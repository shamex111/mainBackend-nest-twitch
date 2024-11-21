import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from 'src/config/jwt.config';
import { JwtStrategy } from './jwt.strategy';
import { ProviderModule } from './provider/provider.module';
import { getProvidersConfig } from 'src/config/providers.config';
import { getRecaptchaConfig } from 'src/config/recaptcha.config';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';
import { EmailConfirmationService } from './email-confirmation/email-confirmation.service';
import { TwoFactorAuthService } from './two-factor-auth/two-factor-auth.service';
import { MailService } from 'src/libs/mail/mail.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserService,MailService,JwtStrategy,TwoFactorAuthService,EmailConfirmationService],
  imports: [ ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),
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
  exports:[AuthService]
})
export class AuthModule {}
