import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TokenType } from 'src/core/prisma/__generated__';
import { MailService } from 'src/modules/libs/mail/mail.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { UserService } from 'src/modules/user/user.service';
import { v4 as uuidv4 } from 'uuid';
import { SendPasswordDto } from './dto/sendPassword.dto';
import { NewPasswordDto } from './dto/newPassword.dto';
import { hash } from 'argon2';

@Injectable()
export class PasswordRecoveryService {
  public constructor(
    private readonly mailService: MailService,
    private readonly userService: UserService,
    private readonly prismaService: PrismaService,
  ) {}

  //ПРО ОЧЕРЕДИ ЧЧЕКНУТЬ
  //ПРО ОЧЕРЕДИ ЧЧЕКНУТЬ
  //ПРО ОЧЕРЕДИ ЧЧЕКНУТЬ
  //ПРО ОЧЕРЕДИ ЧЧЕКНУТЬ
  //ПРО ОЧЕРЕДИ ЧЧЕКНУТЬ
  public async sendPasswordRecovery(dto: SendPasswordDto) {
    const existingUser = await this.userService.findByEmail(dto.email);

    if (!existingUser)
      throw new NotFoundException(
        'Пользователя для отправки с данным email несуществует.Пожалуйста, проверьте корректность введенных данных.',
      );
    const token = await this.generatePasswordRecoveryToken(dto.email);

    await this.mailService.sendPasswordReset(existingUser.email, token.token);

    return true;
  }

  public async newPassword(dto: NewPasswordDto) {
    const existingToken = await this.prismaService.token.findFirst({
      where: {
        token: dto.token,
        type: TokenType.PASSWORD_RESET,
      },
    });

    if (!existingToken)
      throw new NotFoundException(
        'Токен для смены пароля не найден.Пожалуйста, проверьте корректность введенных данных.',
      );

    const isExpired = new Date(existingToken.expiresIn) < new Date();

    if (isExpired)
      throw new BadRequestException(
        'Токен для смены пароля истек.Пожалуйста, запросите новый токен.',
      );

    const existingUser = await this.userService.findByEmail(
      existingToken.email,
    );

    if (!existingUser)
      throw new NotFoundException(
        'Пользователь для смены пароля не существует.Пожалуйста, проверьте корректность введенных данных.',
      );

    await this.prismaService.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        password: await hash(dto.newPassword),
      },
    });

    await this.prismaService.token.delete({
      where: {
        id: existingToken.id,
      },
    });

    return true;
  }

  private async generatePasswordRecoveryToken(email: string) {
    const token = uuidv4();
    const expiresIn = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await this.prismaService.token.findFirst({
      where: {
        email,
        type: TokenType.PASSWORD_RESET,
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
        type: TokenType.PASSWORD_RESET,
      },
    });

    return newToken;
  }
}
