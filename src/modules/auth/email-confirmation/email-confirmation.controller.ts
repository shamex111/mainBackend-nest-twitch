import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { EmailConfirmationService } from './email-confirmation.service';
import { ConfirmationDto } from './dto/confirmation.dto';

@Controller('email-confirmation')
export class EmailConfirmationController {
  public constructor(
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @Post('confirmation')
  @HttpCode(HttpStatus.OK)
  public async confirmation(@Body() dto: ConfirmationDto) {
    return this.emailConfirmationService.newVerification(dto);
  }
}
