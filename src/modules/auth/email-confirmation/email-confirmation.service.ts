import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TokenType } from 'src/core/prisma/__generated__';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from 'src/modules/libs/mail/mail.service';
import { UserService } from 'src/modules/user/user.service';
import { ConfirmationDto } from './dto/confirmation.dto';

@Injectable()
export class EmailConfirmationService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
    private readonly userService: UserService,
  ) {}

  public async newVerification(dto: ConfirmationDto) {
    let existingToken = await this.prismaService.token.findFirst({
      where: {
        token: dto.token,
        type: TokenType.VERIFICATION,
      },
    });
    if (!existingToken)
      throw new NotFoundException(
        'Токен для верификации не найден.Пожалуйста, проверьте корректность токена.',
      );

    const isExpired = new Date(existingToken.expiresIn) < new Date();

    if (isExpired)
      throw new BadRequestException(
        'Токен для верификации истек.Пожалуйста, запросите новый токен.',
      );
    const existingUser = await this.userService.findByEmail(
      existingToken.email,
    );

    if (!existingUser)
      throw new NotFoundException(
        'Пользователь для верификации не найден.Пожалуйста, проверьте корректность введенных данных.',
      );

    const verifiedUser = await this.prismaService.user.update({
      where: {
        email: existingUser.email,
      },
      data: {
        isVerified: true,
      },
    });
    await this.prismaService.token.delete({
      where: {
        id: existingToken.id,
        type: TokenType.VERIFICATION,
      },
    });
    return true;
  }

  public async sendVerificationUser(email: string) {
    const verificationToken = await this.generateVerificationToken(email);

    await this.mailService.sendEmailConfirmation(
      email,
      verificationToken.token,
    );

    return true;
  }

  private async generateVerificationToken(email: string) {
    const token = uuidv4();
    const expiresIn = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await this.prismaService.token.findFirst({
      where: {
        email,
        type: TokenType.VERIFICATION,
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
        type: TokenType.VERIFICATION,
        expiresIn,
      },
    });
    return newToken;
  }
}
