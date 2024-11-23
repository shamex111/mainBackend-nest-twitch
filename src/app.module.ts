import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IS_DEV_ENV } from './libs/common/utils/is-dev.util';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { MailModule } from './libs/mail/mail.module';
import { ProviderModule } from './auth/provider/provider.module';
import { EmailConfirmationModule } from './auth/email-confirmation/email-confirmation.module';
import { TwoFactorAuthModule } from './auth/two-factor-auth/two-factor-auth.module';
import { PasswordRecoveryModule } from './auth/password-recovery/password-recovery.module';
import { getRedisConfig } from './config/redis.config';
import { EmailChangeModule } from './auth/email-change/email-change.module';
import { SessionModule } from './auth/session/session.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: !IS_DEV_ENV,
      isGlobal: true,
    }),
    RedisModule,
    UserModule,
    AuthModule,
    PrismaModule,
    MailModule,
    ProviderModule,
    EmailConfirmationModule,
    TwoFactorAuthModule,
    PasswordRecoveryModule,
    EmailChangeModule,
    SessionModule,
  ],

  controllers: [],
  providers: [],
})
export class AppModule {}
