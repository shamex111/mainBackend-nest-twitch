import { BadRequestException, Injectable } from '@nestjs/common';
import { AssignModeratorDto } from './dto/assignModerator.dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { create } from 'domain';
import { UserService } from 'src/modules/user/user.service';
import { RemoveModeratorDto } from './dto/removeModerator.dto';
import { BanDto } from './dto/ban.dto';
import { CheckUserStatusDto } from './dto/checkUserStatus.dto';
import { UnbanDto } from './dto/unban.dto';

@Injectable()
export class ModeratorService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
  ) {}

  public async assignModerator(dto: AssignModeratorDto, userId: string) {
    const user = await this.userService.findById(dto.userId);
    const isExist = await this.prismaService.moderator.findFirst({
      where: {
        streamerId: userId,
        userId: user.id,
      },
    });
    if (isExist)
      throw new BadRequestException('Пользователь уже назначен модератором.');
    return this.prismaService.moderator.create({
      data: {
        streamerId: userId,
        userId: user.id,
      },
    });
  }

  public async removeModerator(dto: RemoveModeratorDto, userId: string) {
    if (dto.userId === userId)
      throw new BadRequestException(
        'Владелец канала не может быть снять с роли модератора.',
      );
    const user = await this.userService.findById(dto.userId);
    const isExist = await this.checkIsModerator(dto.userId, userId);
    if (!isExist)
      throw new BadRequestException(
        'Пользователь итак не является модератором.',
      );
    await this.prismaService.moderator.delete({
      where: {
        id: isExist.id,
      },
    });
    return { message: 'Пользователь успешно снят с роли модератора.' };
  }

  public async ban(dto: BanDto, userId: string) {
    const isModerator = await this.checkIsModerator(userId, dto.streamerId);
    if (!isModerator)
      throw new BadRequestException('Пользователь не является модератором.');
    if (dto.userId === dto.streamerId)
      throw new BadRequestException(
        'Нельзя назначить органичения владельцу канала.',
      );
    const isUserForAssigningRestrictionsModerator =
      await this.prismaService.moderator.findFirst({
        where: {
          streamerId: dto.streamerId,
          userId: dto.userId,
        },
      });
    if (isUserForAssigningRestrictionsModerator)
      throw new BadRequestException(
        'Нельзя назначить ограничения на модерторов канала.',
      );
    const existsBan = await this.prismaService.ban.findFirst({
      where: {
        streamerId: dto.streamerId,
        userId: dto.userId,
      },
    });
    if (existsBan) {
      await this.prismaService.ban.delete({
        where: {
          id: existsBan.id,
        },
      });
    }
    const expiresAtObj =
      dto.expiresAt && dto.action === 'MUTE'
        ? { expiresAt: dto.expiresAt }
        : {};

    return this.prismaService.ban.create({
      data: {
        userId: dto.userId,
        moderatorId: isModerator.id,
        streamerId: dto.streamerId,
        reason: dto.reason,
        action: dto.action,
        ...expiresAtObj,
      },
    });
  }

  public async unban(dto: UnbanDto, userId: string) {
    const moderator = await this.checkIsModerator(userId, dto.streamerId);
    if (!moderator)
      throw new BadRequestException(
        'Пользователь не является модератором канала.',
      );

    const isExistBan = await this.prismaService.ban.findFirst({
      where: {
        userId: dto.userId,
        streamerId: dto.streamerId,
      },
    });
    if (!isExistBan)
      throw new BadRequestException('Пользователь итак не имеет ограничений.');

    await this.prismaService.ban.delete({
      where: {
        id: isExistBan.id,
      },
    });

    return { message: 'С пользователя успешно сняты все ограничения.' };
  }

  public async checkIsUserBannedOrMuted(
    userId: string,
    dto: CheckUserStatusDto,
  ) {
    const ban = await this.prismaService.ban.findFirst({
      where: {
        userId,
        streamerId: dto.streamerId,
      },
    });
    if (!ban) return { isUserBannedOrMuted: false, type: null };
    const isExpired = ban.expiresAt
      ? new Date(ban.expiresAt) < new Date()
      : false;

    if (isExpired) {
      await this.prismaService.ban.delete({
        where: {
          id: ban.id,
        },
      });
      return { isUserBannedOrMuted: false, type: null };
    }
    return { isUserBannedOrMuted: true, type: ban.action };
  }

  public async checkIsModerator(userId: string, streamerId: string) {
    const moderator = await this.prismaService.moderator.findFirst({
      where: {
        streamerId,
        userId,
      },
    });
    if (!moderator && userId === streamerId) {
      await this.prismaService.moderator.create({
        data: {
          streamerId,
          userId,
        },
      });
    }
    return moderator || false;
  }
}
