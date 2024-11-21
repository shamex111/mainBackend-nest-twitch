import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { render } from '@react-email/components';
import { EmailConfirmationTemplate } from './templates/EmailConfirmation.template';
import { ResetPasswordTemplate } from './templates/EmailResetPassword.template';
import { TwoFactorAuthTemplate } from './templates/EmailTwoFactor.template';
@Injectable()
export class MailService {
  public constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  public async sendEmailConfirmation(email: string, token: string) {
    const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN');
    const html = await render(EmailConfirmationTemplate({ domain, token }));

    return this.sendMail(email, 'Подтверждение почты', html);
  }
  public async sendPasswordReset(email: string, token: string) {
    const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN');
    const html = await render(ResetPasswordTemplate({ domain, token }));

    return this.sendMail(email, 'Сброс пароля', html);
  }
  public async sendTwoFactorAuth(email: string, token: string) {
    const html = await render(TwoFactorAuthTemplate({ token }));

    return this.sendMail(email, 'Подтверждение вашей личности', html);
  }

  private async sendMail(email: string, subject: string, html: string) {
    return this.mailerService.sendMail({
      to: email,
      subject,
      html,
    });
  }
}
