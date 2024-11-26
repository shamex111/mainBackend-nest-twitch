import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IS_DEV_ENV } from './modules/libs/common/utils/is-dev.util';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { MailModule } from './modules/libs/mail/mail.module';
import { ProviderModule } from './modules/auth/provider/provider.module';
import { EmailConfirmationModule } from './modules/auth/email-confirmation/email-confirmation.module';
import { TwoFactorAuthModule } from './modules/auth/two-factor-auth/two-factor-auth.module';
import { PasswordRecoveryModule } from './modules/auth/password-recovery/password-recovery.module';
import { EmailChangeModule } from './modules/auth/email-change/email-change.module';
import { RedisModule } from './core/redis/redis.module';
import { ChannelModule } from './modules/channel/channel.module';
import { ChatModule } from './modules/chat/chat.module';
import { NotificationModule } from './modules/notification/notification.module';
import { SubscriptionModule } from './modules/channel/subscription/subscription.module';
import { ModeratorModule } from './modules/channel/moderator/moderator.module';
import { CurrencyModule } from './modules/channel/currency/currency.module';
import { RewardModule } from './modules/channel/reward/reward.module';
import { S3Module } from './modules/libs/s3/s3.module';

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
    ChannelModule,
    ChatModule,
    NotificationModule,
    SubscriptionModule,
    ModeratorModule,
    CurrencyModule,
    RewardModule,
    S3Module,
  ],

  controllers: [],
  providers: [],
})
export class AppModule {}
