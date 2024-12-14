import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Recaptcha } from '@nestlab/google-recaptcha';
import { Provider } from './decorators/provider.decorator';
import { Request, Response } from 'express';
import { ProviderService } from './provider/provider.service';
import { ConfigService } from '@nestjs/config';
import { UserAgent } from './decorators/user-agent.decorator';

@Controller('auth')
export class AuthController {
  public constructor(
    private readonly authService: AuthService,
    private readonly providerService: ProviderService,
    private readonly configService: ConfigService,
  ) {}

  @Recaptcha()
  @Post('register')
  @HttpCode(HttpStatus.OK)
  public async register(
    @Body() dto: RegisterDto,
    @Req() req: Request,
    @UserAgent() userAgent: string,
  ) {
    return this.authService.register(dto, req, userAgent);
  }

  @Recaptcha()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @UserAgent() userAgent: string,
  ) {
    return this.authService.login(dto, req, userAgent);
  }

  @Get('/oauth/callback/:provider')
  @Provider()
  public async callback(
    @Res({ passthrough: true }) res: Response,
    @Query('code') code: string,
    @Param('provider') provider: string,
    @Req() req: Request,
    @UserAgent() userAgent: string,
  ) {
    if (!code) {
      throw new BadRequestException('Не был предоставлен код авторизации');
    }
    await this.authService.extractProfileFromCode(
      provider,
      code,
      req,
      userAgent,
    );
    return res.redirect(
      `${this.configService.getOrThrow<string>('ALLOWED_ORIGIN')}/dashboard/settings`,
    );
  }

  @Provider()
  @Get('/oauth/connect/:provider')
  public async connect(@Param('provider') provider: string) {
    const providerInstance = this.providerService.findByService(provider);
    return {
      url: providerInstance.getAuthUrl(),
    };
  }
}
