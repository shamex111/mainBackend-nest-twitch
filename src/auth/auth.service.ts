import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.dto';
import { AuthMethod } from 'prisma/__generated__';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { verify } from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProviderService } from './provider/provider.service';
import { EmailConfirmationService } from './email-confirmation/email-confirmation.service';
import { TwoFactorAuthService } from './two-factor-auth/two-factor-auth.service';

@Injectable()
export class AuthService {
  public constructor(
    private readonly userService: UserService,
    private readonly jwt: JwtService,
    private readonly providerService: ProviderService,
    private readonly prismaService: PrismaService,
    private readonly emailConfirmationService:EmailConfirmationService,
    private readonly twoFactorAuthService:TwoFactorAuthService
  ) {}

  public async register(dto: RegisterDto) {
    const newUser = await this.userService.create({
      email: dto.email,
      name: dto.name,
      password: dto.password,
      method: AuthMethod.CREDENTIALS,
    });

    await this.emailConfirmationService.sendVerificationUser(newUser.email);
    return {
      message:
        'Вы успешно зарегестрировались. Пожалуйста, подтвердите ваш email. Сообщение было отправлено на ваш почтовый адрес.',
    };
  }

  public async login(dto: LoginDto) {
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
      await this.emailConfirmationService.sendVerificationUser(user.email);
      throw new UnauthorizedException(
        'Ваш email не подтвержден. Пожалуйста, проверьте вашу почту и подтвердите адрес.',
      );
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
        );
    }

    const tokens = this.issueTokens({ id: user.id, name: user.name });

    return { user, ...tokens };
  }

  public async extractProfileFromCode(
    req: Request,
    provider: string,
    code: string,
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
      const tokens = this.issueTokens({ id: user.id, name: user.name });

      return { user, ...tokens };
    }

    user = await this.userService.create({
      email: profile.email,
      name: profile.name,
      password: '',
      method: AuthMethod[profile.provider.toUpperCase()],
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
    const tokens = this.issueTokens({ id: user.id, name: user.name });

    return { user, ...tokens };
  }

  async getNewTokens(refreshToken: string) {
    const result = this.jwt.verify(refreshToken);

    if (!result)
      throw new UnauthorizedException(
        'Невалидный refresh токен.Пожалуйста, проверьте корректность введенного токена или запросите новый.',
      );
    let user = await this.userService.findById(result.id);

    const tokens = this.issueTokens({ id: user.id, name: user.name });

    return {
      user,
      ...tokens,
    };
  }

  private issueTokens(user: { id: string; name: string }) {
    const payload = { id: user.id, username: user.name };

    const accessToken = this.jwt.sign(payload, {
      expiresIn: '30m',
    });

    const refreshToken = this.jwt.sign(payload, {
      expiresIn: '7d',
    });
    return { accessToken, refreshToken };
  }
}
