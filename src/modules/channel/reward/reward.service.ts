import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRewardDto } from './dto/createReward.dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { DeleteRewardDto } from './dto/deleteReward.dto';
import { BuyRewardDto } from './dto/buyReward.dto';
import { CurrencyService } from '../currency/currency.service';

@Injectable()
export class RewardService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly currencyService: CurrencyService,
  ) {}

  public async createReward(dto: CreateRewardDto, userId: string) {
    return await this.prismaService.userReward.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  public async deleteReward(dto: DeleteRewardDto, userId: string) {
    const userReward = await this.prismaService.userReward.findUnique({
      where: {
        id: dto.userRewardId,
        userId,
      },
    });
    if (!userReward)
      throw new NotFoundException('Награда с таким id у вас не найдена.');
    await this.prismaService.userReward.delete({
      where: {
        id: userReward.id,
      },
    });
    return { message: 'Награда успешно удалена.' };
  }

  public async buyReward(dto: BuyRewardDto, userId: string) {
    const userReward = await this.prismaService.userReward.findUnique({
      where: {
        id: dto.rewardId,
      },
    });
    if (!userReward)
      throw new NotFoundException('Награда с таким id для покупка не найдена.');

    const streamerCurrency =
      await this.prismaService.streamerCurrency.findFirst({
        where: {
          userId: userReward.userId,
        },
      });

    if (!streamerCurrency)
      throw new NotFoundException(
        'Валюта стримера для покупки награды не найдена.',
      );

    await this.currencyService.decrementBalance(
      userId,
      streamerCurrency.id,
      userReward.price,
    );

    return this.prismaService.buyerReward.create({
      data: {
        rewardId: dto.rewardId,
        userId,
      },
    });
  }
}
