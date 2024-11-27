import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { UserCreateDto } from './dto/createUser.dto';
import { hash } from 'argon2';
import { UpdateUserDto } from './dto/updateUser.dto';
import { TwoFactorAuthService } from 'src/modules/auth/two-factor-auth/two-factor-auth.service';
import { User } from 'src/core/prisma/__generated__';
import { S3Service } from '../libs/s3/s3.service';
import * as sharp from 'sharp';
import { randomHexColor } from 'random-hex-color-generator';

@Injectable()
export class UserService {
  public constructor(
    private readonly prismaService: PrismaService,
    @Inject(forwardRef(() => TwoFactorAuthService))
    private readonly twoFactorAuthService: TwoFactorAuthService,

    private readonly s3Service: S3Service,
  ) {}

  public async create(dto: UserCreateDto) {
    const isExists = await this.findByEmail(dto.email);

    if (isExists)
      throw new BadRequestException(
        'Пользователь с таким email уже создан.Пожалуйста, используйте другой email.',
      );

    const description = `Мы пока ничего не знаем о ${dto.name}, но точно знаем что ${dto.name} - хороший человек!`;
    const avatar = '';
    const color = randomHexColor();
    const banner = '';

    const user = await this.prismaService.user.create({
      data: {
        email: dto.email,
        password: await hash(dto.password),
        name: dto.name,
        method: dto.method,
        isVerified: dto.isVerified,
        description,
        color,
        avatar,
        banner,
      },
    });
    // await this.moderatorService.assignModerator({ userId:user.id }, user.id);
    // await this.chatService.create(user.id)
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
  public async changeAvatar(user: User, file: Express.Multer.File) {
    if (user.avatar) {
      await this.s3Service.deleteFile(user.avatar);
    }

    const fileName = `/users/${user.id}.webp`;

    const processedBuffer = await sharp(file.buffer)
      .resize(512, 512)
      .webp()
      .toBuffer();

    await this.s3Service.uploadFile(processedBuffer, fileName, 'image/webp');

    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        avatar: fileName,
      },
    });

    return true;
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
