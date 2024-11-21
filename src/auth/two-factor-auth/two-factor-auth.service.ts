import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomInt } from 'crypto';
import { TokenType } from 'prisma/__generated__';
import { MailService } from 'src/libs/mail/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TwoFactorAuthService {
  public constructor(
    private readonly mailService: MailService,
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
  ) {}

  public async validateToken(code: string, email: string) {
    const existingToken = await this.prismaService.token.findFirst({
      where: {
        email,
        type: TokenType.TWO_FACTOR,
      },
    });

    if (!existingToken)
      throw new NotFoundException(
        'Токен не найден.Пожалуйста, проверьте правильность введеной почты.',
      );

    const isExpired = new Date(existingToken.expiresIn) < new Date();

    if (isExpired)
      throw new BadRequestException(
        'Код для 2-ой аутентификации просрочен.Пожалуйста, запросите новый код.',
      );

    if (code !== existingToken.token)
      throw new BadRequestException(
        'Код для 2-ой аутентификации неверный.Пожалуйста, проверьте правильность кода или запросите новый.',
      );

    await this.prismaService.token.delete({
      where: {
        id: existingToken.id,
        type: TokenType.TWO_FACTOR,
      },
    });

    return true;
  }

  public async sendTwoFactor(email: string) {
    const existingUser = await this.userService.findByEmail(email);

    if (!existingUser)
      throw new NotFoundException(
        'Пользователь для отправки 2-ой аутентификации не найден.Пожалуйста, проверьте правильность ввденных данных.',
      );

    const token = await this.generateTwoFactorToken(email);

    await this.mailService.sendTwoFactorAuth(email, token.token);

    return true;
  }

  public async generateTwoFactorToken(email: string) {
    const token = randomInt(100000, 1000000).toString();
    
    const expiresIn = new Date(new Date().getTime() + 300000);

    const existingToken = await this.prismaService.token.findFirst({
      where: {
        email,
        type: TokenType.TWO_FACTOR,
      },
    });
    if (existingToken) {
      await this.prismaService.token.delete({
        where: {
          id: existingToken.id,
        },
      });
    }

    const newToken = await this.prismaService.token.create({
      data: {
        token,
        email,
        expiresIn,
        type: TokenType.TWO_FACTOR,
      },
    });

    return newToken;
  }
}
