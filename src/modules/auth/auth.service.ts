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

@Injectable()
export class AuthService {
  public constructor(
    private readonly userService: UserService,
    private readonly providerService: ProviderService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly emailConfirmationService: EmailConfirmationService,
    private readonly twoFactorAuthService: TwoFactorAuthService,
  ) {}
  protected parser = new UAParser();
  public async register(dto: RegisterDto, req: Request) {
    const newUser = await this.userService.create({
      email: dto.email,
      name: dto.name,
      password: dto.password,
      method: AuthMethod.CREDENTIALS,
    });

    this.emailConfirmationService.sendVerificationUser(newUser.email);

    return this.saveSession(req, newUser);
  }

  public async login(dto: LoginDto, req: Request) {
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

    return this.saveSession(req, user);
  }

  public async extractProfileFromCode(
    provider: string,
    code: string,
    req: Request,
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
      return this.saveSession(req, user);
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
    return this.saveSession(req, user);
  }

  public async logout(req: Request, res: Response): Promise<void> {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          return reject(
            new InternalServerErrorException(
              'Не удалось завершить сессию. Возможно, возникла проблема с серве  ром или сессия уже была завершена.',
            ),
          );
        }
        res.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'));
        resolve();
      });
    });
  }
  public async saveSession(req: Request, user: User) {
    try {
      req.session.userId = user.id;

      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) {
            return reject(
              new InternalServerErrorException(
                'Не удалось сохранить сессию. Проверьте, правильно ли настроены параметры сессии.',
              ),
            );
          }
          resolve();
        });
      });

      return { user };
    } catch (error) {
      throw new InternalServerErrorException(
        'Ошибка при сохранении сессии',
        error,
      );
    }
  }
}
