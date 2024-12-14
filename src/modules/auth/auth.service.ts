import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { RegisterDto } from './dto/register.dto';
import { AuthMethod, User } from 'src/core/prisma/__generated__';
import { LoginDto } from './dto/login.dto';
import { verify } from 'argon2';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { ProviderService } from './provider/provider.service';
import { EmailConfirmationService } from './email-confirmation/email-confirmation.service';
import { TwoFactorAuthService } from './two-factor-auth/two-factor-auth.service';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { UAParser } from 'ua-parser-js';
import { SessionService } from './session/session.service';

@Injectable()
export class AuthService {
  public constructor(
    private readonly userService: UserService,
    private readonly providerService: ProviderService,
    private readonly prismaService: PrismaService,
    private readonly emailConfirmationService: EmailConfirmationService,
    private readonly twoFactorAuthService: TwoFactorAuthService,
    private readonly sessionService: SessionService,
  ) {}
  protected parser = new UAParser();
  public async register(dto: RegisterDto, req: Request, userAgent: string) {
    const newUser = await this.userService.create({
      email: dto.email,
      name: dto.name,
      password: dto.password,
      method: AuthMethod.CREDENTIALS,
    });

    this.emailConfirmationService.sendVerificationUser(newUser.email);

    return this.sessionService.saveSession(userAgent, req, newUser);
  }

  public async login(dto: LoginDto, req: Request, userAgent: string) {
    const user = await this.userService.findByEmail(dto.email);

    if (!user)
      throw new NotFoundException(
        'Пользователь с таким email не найден.Пожалуйста, проверьте правильность введенных данных.',
      );

    const isValidPassport = await verify(user.password, dto.password);
    if (!isValidPassport) {
      throw new UnauthorizedException(
        'Неверный пароль! Пожалуйста, попробуйте еще раз или восстановите его пароль, если забыли его.',
      );
    }

    if (!user.isVerified) {
      this.emailConfirmationService.sendVerificationUser(user.email);
    }
    if (user.isTwoFactorEnabled) {
      if (!dto.code) {
        await this.twoFactorAuthService.sendTwoFactor(user.email);
        return {
          message:
            'Проверьте вашу почту. Требуется код двухфакторной аутентификации.',
        };
      }

      await this.twoFactorAuthService.validateToken(
        dto.code,
        user.email,
        'login',
      );
    }

    return this.sessionService.saveSession(userAgent, req, user);
  }

  public async extractProfileFromCode(
    provider: string,
    code: string,
    req: Request,
    userAgent: string,
  ) {
    const providerInstance = this.providerService.findByService(provider);
    const profile = await providerInstance.findUserByCode(code);
    const account = await this.prismaService.account.findFirst({
      where: {
        id: profile.id,
        provider: profile.provider,
      },
    });

    let user = account?.userId
      ? await this.userService.findById(account.userId)
      : null;

    if (user) {
      return this.sessionService.saveSession(userAgent, req, user);
    }

    user = await this.userService.create({
      email: profile.email,
      name: profile.name,
      password: '',
      method: AuthMethod[profile.provider.toUpperCase()],
      isVerified: true,
    });

    if (!account) {
      await this.prismaService.account.create({
        data: {
          userId: user.id,
          type: 'auth',
          provider: profile.provider,
          refreshToken: profile.refresh_token,
          accessToken: profile.access_token,
          expiresAt: profile.expires_at,
        },
      });
    }
    return this.sessionService.saveSession(userAgent, req, user);
  }
}
