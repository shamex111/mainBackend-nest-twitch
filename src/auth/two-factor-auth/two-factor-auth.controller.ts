import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { Recaptcha } from '@nestlab/google-recaptcha';
import { TwoFactorAuthService } from './two-factor-auth.service';
import { ResetTwoFactorAuthDto } from './dto/resetTwoFactorAuth.dto';

@Controller('two-factor')
export class TwoFactorAuthController {
  public constructor(
    private readonly twoFactorAuthService: TwoFactorAuthService,
  ) {}

  @Post('send-reset-email')
  @HttpCode(HttpStatus.OK)
  async sendReset(@Body() dto:ResetTwoFactorAuthDto) {
    return this.twoFactorAuthService.sendTwoFactorReset(dto.email)
  }
}
