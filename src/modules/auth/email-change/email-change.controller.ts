import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { EmailChangeService } from './email-change.service';
import { Recaptcha } from '@nestlab/google-recaptcha';
import { SendChangeEmailDto } from './dto/sendChangeEmail.dto';
import { ChangeEmailDto } from './dto/changeEmail.dto';

@Controller('email-change')
export class EmailChangeController {
  constructor(private readonly emailChangeService: EmailChangeService) {}

  @Post('send-change-email')
  @HttpCode(HttpStatus.OK)
  public async send(@Body() dto: SendChangeEmailDto) {
    return this.emailChangeService.sendEmailChange(dto.email);
  }

  @Recaptcha()
  @Post('email-change')
  @HttpCode(HttpStatus.OK)
  public async emailChange(@Body() dto:ChangeEmailDto) {
    return this.emailChangeService.changeEmail(dto)
  }
}
