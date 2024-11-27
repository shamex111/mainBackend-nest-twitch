import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FollowDto } from './dto/follow.dto';
import { UserService } from 'src/modules/user/user.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { UnfollowDto } from './dto/unfollow.dto';
import { CreateDescriptionPartDto } from './dto/createDescriptionPart.dto';
import { DeleteDescriptionPartDto } from './dto/deleteDescriptionPart.dto';
import { CreateEmoteDto } from './dto/createEmote.dto';
import { DeleteEmoteDto } from './dto/deleteEmote.dto';
import { S3Service } from '../libs/s3/s3.service';
import * as sharp from 'sharp';

@Injectable()
export class ChannelService {
  public constructor(
    private readonly userService: UserService,
    private readonly prismaService: PrismaService,
    private readonly s3Service: S3Service,
  ) {}

  public async follow(dto: FollowDto, userId: string) {
    const streamer = await this.userService.findById(dto.streamerId);

    if (streamer.id === userId)
      throw new BadRequestException(
        'Вы не может подписываться на самого себя.',
      );

    const isExistFollow = await this.prismaService.follower.findFirst({
      where: {
        userId,
        streamerId: streamer.id,
      },
    });

    if (isExistFollow)
      throw new BadRequestException('Вы уже подписаны на стримера.');

    const newFollower = await this.prismaService.follower.create({
      data: {
        userId,
        streamerId: streamer.id,
      },
    });
    await this.prismaService.user.update({
      where: {
        id: streamer.id,
      },
      data: {
        countFollowers: {
          increment: 1,
        },
      },
    });
    return newFollower;
  }

  public async unfollow(dto: UnfollowDto, userId: string) {
    const streamer = await this.userService.findById(dto.streamerId);

    if (streamer.id === userId)
      throw new BadRequestException('Вы не может отписываться от самого себя.');

    const isExistFollow = await this.prismaService.follower.findFirst({
      where: {
        userId,
        streamerId: streamer.id,
      },
    });

    if (!isExistFollow)
      throw new BadRequestException('Вы не подписан на стримера.');

    await this.prismaService.follower.delete({
      where: {
        id: isExistFollow.id,
      },
    });

    await this.prismaService.user.update({
      where: {
        id: streamer.id,
      },
      data: {
        countFollowers: {
          decrement: 1,
        },
      },
    });
    return { message: 'Успешная отписка.' };
  }

  public async createDescriptionPart(
    dto: CreateDescriptionPartDto,
    userId: string,
    file: Express.Multer.File,
  ) {
    const newDescriptionPart = await this.prismaService.descriptionPart.create({
      data: {
        userId,
        image: '',
        description: dto.description,
        url: dto.url,
      },
    });
    const fileName = `/description-parts/${newDescriptionPart.id}.webp`;

    const processedBuffer = await sharp(file.buffer)
      .resize(512, 512)
      .webp()
      .toBuffer();

    await this.s3Service.uploadFile(processedBuffer, fileName, 'image/webp');

    return this.prismaService.descriptionPart.update({
      where: {
        id: newDescriptionPart.id,
      },
      data: {
        image: fileName,
      },
    });
  }

  public async deleteDescriptionPart(
    dto: DeleteDescriptionPartDto,
    userId: string,
  ) {
    const existingDescriptionPartDto =
      await this.prismaService.descriptionPart.findFirst({
        where: {
          userId,
          id: dto.descriptionPartId,
        },
      });
    if (!existingDescriptionPartDto)
      throw new NotFoundException(
        'Часть описания с таким id у вас не найдена.',
      );
    await this.s3Service.deleteFile(existingDescriptionPartDto.image);
    await this.prismaService.descriptionPart.delete({
      where: {
        id: existingDescriptionPartDto.id,
      },
    });

    return { message: 'Успешное удаление части описания.' };
  }

  public async createEmote(
    dto: CreateEmoteDto,
    userId: string,
    file: Express.Multer.File,
  ) {
    const isExist = await this.prismaService.emote.findFirst({
      where: {
        tag: userId + dto.name,
      },
    });
    if (isExist)
      throw new BadRequestException('У вас уже создан эмоция с таким именем.');

    const newEmote = await this.prismaService.emote.create({
      data: {
        userId,
        image: '',
        name: dto.name,
        tag: userId + dto.name,
      },
    });

    const fileName = `/emotes/${newEmote.id}.webp`;

    const processedBuffer = await sharp(file.buffer)
      .resize(128, 128)
      .webp()
      .toBuffer();

    await this.s3Service.uploadFile(processedBuffer, fileName, 'image/webp');
    return this.prismaService.emote.update({
      where: {
        id: newEmote.id,
      },
      data: {
        image: fileName,
      },
    });
  }

  public async deleteEmote(dto: DeleteEmoteDto, userId: string) {
    const isExist = await this.prismaService.emote.findFirst({
      where: {
        id: dto.id,
        userId,
      },
    });
    if (!isExist) throw new BadRequestException('У вас нет эмоции с таким id.');
    await this.s3Service.deleteFile(isExist.image);
    await this.prismaService.emote.delete({
      where: {
        id: isExist.id,
      },
    });
    return { message: 'Эмоция успешно удалена.' };
  }
}
