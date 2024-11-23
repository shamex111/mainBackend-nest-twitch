import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserCreateDto } from './dto/createUser.dto';
import { hash } from 'argon2';
import { UpdateUserDto } from './dto/updateUser.dto';
import { TwoFactorAuthService } from 'src/auth/two-factor-auth/two-factor-auth.service';
@Injectable()
export class UserService {
  public constructor(
    private readonly prismaService: PrismaService,
    @Inject(forwardRef(() => TwoFactorAuthService))
    private readonly twoFactorAuthService: TwoFactorAuthService,
  ) {}

  public async create(dto: UserCreateDto) {
    const isExists = await this.findByEmail(dto.email);

    if (isExists)
      throw new BadRequestException(
        'Пользователь с таким email уже создан.Пожалуйста, используйте другой email.',
      );

    const user = await this.prismaService.user.create({
      data: {
        email: dto.email,
        password: await hash(dto.password),
        name: dto.name,
        method: dto.method,
        isVerified: dto.isVerified,
      },
    });
    return user;
  }

  public async update(dto: UpdateUserDto, userId: string) {
    const user = await this.findById(userId);

    if (Object.keys(dto).length === 0) {
      throw new BadRequestException(
        'Нет данных для обновления.Пожалуйста, введите хоть какие-то изменения для изменния пользователя.',
      );
    }

    if (dto.isTwoFactorEnabled === false) {
      if (user.isTwoFactorEnabled) {
        const email = (await this.findById(userId)).email;
        await this.twoFactorAuthService.validateToken(dto.code, email, 'reset');
      }
    }
    if (dto.code) delete dto.code;
    const updatedUser = await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        ...dto,
      },
    });

    return updatedUser;
  }

  public async findByEmail(email: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        email,
      },
    });

    return user;
  }

  public async findById(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
    if (!user)
      throw new NotFoundException(
        'Пользователь с указанным id не найден.Пожалуйста, проверьте правильность введенного id.',
      );
    return user;
  }
}
