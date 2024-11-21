import { isDev } from '../libs/common/utils/is-dev.util';
import { ConfigService } from '@nestjs/config';
import { GoogleRecaptchaModuleOptions } from '@nestlab/google-recaptcha';
export const getRecaptchaConfig = async (
  ConfigService: ConfigService,
): Promise<GoogleRecaptchaModuleOptions> => ({
  secretKey: ConfigService.getOrThrow<string>('GOOGLE_RECAPTCHA_SECRET_KEY'),
  response: (req) => req.headers.recaptcha,
  skipIf: isDev(ConfigService),
});
