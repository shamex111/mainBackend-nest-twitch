import { isDev } from '../libs/common/utils/is-dev.util';
import { MailerOptions } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
export const getMailerConfig = async (
  configService: ConfigService,
): Promise<MailerOptions> => ({
    transport:{
        host:configService.getOrThrow<string>('MAIL_HOST'),
        port:configService.getOrThrow<string>('MAIL_PORT'),
        secure:!isDev(configService),
        auth: {
            user:configService.getOrThrow<string>('MAIL_LOGIN'),
            pass:configService.getOrThrow<string>('MAIL_PASSWORD')
        }
    },
    defaults:{
        from:`"Shamex-twitch support-team ${configService.getOrThrow<string>('MAIL_LOGIN')}`
    }
});
