import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomInt } from 'crypto';
import { TokenType } from 'src/core/prisma/__generated__';
import { MailService } from 'src/modules/libs/mail/mail.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { UserService } from 'src/modules/user/user.service';
import { ChangeEmailDto } from './dto/changeEmail.dto';
@Injectable()
export class EmailChangeService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
    private readonly userService: UserService,
  ) {}

  public async sendEmailChange(email: string) {
    const existingUser = await this.userService.findByEmail(email);

    if (!existingUser)
      throw new NotFoundException(
        'Пользователь для отправки смены пароля не найден.Пожалуйста, проверьте правильность ввденных данных.',
      );

    const token = await this.generateEmailChangeToken(email);

    await this.mailService.sendEmailChange(email, token.token);

    return true;
  }

  public async changeEmail(dto: ChangeEmailDto) {
    const existingToken = await this.prismaService.token.findFirst({
      where: {
        token: dto.token,
      },
    });
    if (!existingToken)
      throw new NotFoundException(
        'Токен для смены почты не найден.Пожалуйста, проверьте корректность введенных данных.',
      );

    const isExpired = new Date(existingToken.expiresIn) < new Date();

    if (isExpired)
      throw new BadRequestException(
        'Токен для смены почты истек.Пожалуйста, запросите новый.',
      );

    const existingUser = await this.userService.findByEmail(
      existingToken.email,
    );

    if (!existingUser)
      throw new NotFoundException(
        'Пользователь для смены почты не существует.Пожалуйста, проверьте корректность введенных данных.',
      );

    const isEmailAlreadyTake = await this.userService.findByEmail(dto.newEmail);
    if (isEmailAlreadyTake)
      throw new BadRequestException(
        'Почта уже занята другим пользователем.Пожалуйста, выберите другую почту для смены.',
      );
    await this.prismaService.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        email: dto.newEmail,
        isVerified: false,
      },
    });

    await this.prismaService.token.delete({
      where: {
        id: existingToken.id,
      },
    });
    return true;
  }

  public async generateEmailChangeToken(email: string) {
    const token = randomInt(100000, 1000000).toString();
    const expiresIn = new Date(new Date().getTime() + 300000);

    const existingToken = await this.prismaService.token.findFirst({
      where: {
        email,
        type: TokenType.EMAIL_CHANGE,
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
        email,
        token,
        expiresIn,
        type: TokenType.EMAIL_CHANGE,
      },
    });

    return newToken;
  }
}
