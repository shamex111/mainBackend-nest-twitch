import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { PasswordRecoveryService } from './password-recovery.service';
import { SendPasswordDto } from './dto/sendPassword.dto';
import { NewPasswordDto } from './dto/newPassword.dto';
import { Recaptcha } from '@nestlab/google-recaptcha';

@Controller('password-recovery')
export class PasswordRecoveryController {
  public constructor(
    private readonly passwordRecoveryService: PasswordRecoveryService,
  ) {}

  @Recaptcha()
  @Post('send-password-recovery')
  @HttpCode(HttpStatus.OK)
  public async send(@Body() dto: SendPasswordDto) {
    return this.passwordRecoveryService.sendPasswordRecovery(dto);
  }

  @Recaptcha()
  @Post('recovery')
  @HttpCode(HttpStatus.OK)
  public async recovery(@Body() dto: NewPasswordDto) {
    return this.passwordRecoveryService.newPassword(dto);
  }
}
