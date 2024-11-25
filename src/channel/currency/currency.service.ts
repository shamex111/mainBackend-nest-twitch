import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCurrencyDto } from './dto/createCurrency.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditCurrencyDto } from './dto/editCurrency.dto';
import { CreateCurrencyBalanceDto } from './dto/CreateCurrencyBalance.dto';

@Injectable()
export class CurrencyService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async createCurrency(dto: CreateCurrencyDto, userId: string) {
    const isExist = await this.prismaService.streamerCurrency.findFirst({
      where: {
        userId,
      },
    });
    if (isExist) throw new BadRequestException('У вас уже есть валюта.');

    return this.prismaService.streamerCurrency.create({
      data: {
        userId,
        ...dto,
      },
    });
  }

  public async deleteCurrency(userId: string) {
    const isExist = await this.prismaService.streamerCurrency.findFirst({
      where: {
        userId,
      },
    });
    if (!isExist) throw new NotFoundException('У вас нет валюты.');

    await this.prismaService.streamerCurrency.delete({
      where: {
        id: isExist.id,
      },
    });
    return { message: 'Валюта успешно удалена.' };
  }

  public async editCurrency(dto: EditCurrencyDto, userId: string) {
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException(
        'Нет данных для обновления.Пожалуйста, введите хоть какие-то изменения для изменния валюты.',
      );
    }
    const isExist = await this.prismaService.streamerCurrency.findFirst({
      where: {
        userId,
      },
    });
    if (!isExist) throw new NotFoundException('У вас нет валюты.');

    return this.prismaService.streamerCurrency.update({
      where: {
        id: isExist.id,
      },
      data: {
        ...dto,
      },
    });
  }

  public async createCurrencyBalance(
    dto: CreateCurrencyBalanceDto,
    userId: string,
  ) {
    const streamerCurrency =
      await this.prismaService.streamerCurrency.findUnique({
        where: {
          id: dto.streamerCurrencyId,
        },
      });
    if (!streamerCurrency)
      throw new NotFoundException('Валюта стримера с таким id не найдена.');
    const isExist = await this.prismaService.currencyBalance.findFirst({
      where: {
        userId,
        streamerCurrencyId: dto.streamerCurrencyId,
      },
    });
    if (isExist) throw new BadRequestException('У вас уже создан кошелек.');

    return this.prismaService.currencyBalance.create({
      data: {
        userId,
        streamerCurrencyId: dto.streamerCurrencyId,
      },
    });
  }

  public async incrementBalance(
    userId: string,
    streamerCurrencyId: string,
    count: number,
  ) {
    const streamerCurrency =
      await this.prismaService.streamerCurrency.findUnique({
        where: {
          id: streamerCurrencyId,
        },
      });
    if (!streamerCurrency)
      throw new NotFoundException('Валюта стримера с таким id не найдена.');

    const currencyBalance = await this.prismaService.currencyBalance.findFirst({
      where: {
        streamerCurrencyId,
        userId,
      },
    });
    if (!currencyBalance)
      throw new NotFoundException(
        'У пользователя нет кошелька данного стримера.',
      );

    return this.prismaService.currencyBalance.update({
      where: {
        id: currencyBalance.id,
      },
      data: {
        count: {
          increment: count,
        },
      },
    });
  }
  public async decrementBalance(
    userId: string,
    streamerCurrencyId: string,
    count: number,
  ) {
    const streamerCurrency =
      await this.prismaService.streamerCurrency.findUnique({
        where: {
          id: streamerCurrencyId,
        },
      });
    if (!streamerCurrency)
      throw new NotFoundException('Валюта стримера с таким id не найдена.');
    const currencyBalance = await this.prismaService.currencyBalance.findFirst({
      where: {
        streamerCurrencyId,
        userId,
      },
    });
    if (!currencyBalance)
      throw new NotFoundException(
        'У пользователя нет кошелька данного стримера.',
      );
    if (currencyBalance.count < count)
      throw new BadRequestException('Недостаточно средств на счете.');

    return this.prismaService.currencyBalance.update({
      where: {
        id: currencyBalance.id,
      },
      data: {
        count: {
          decrement: count,
        },
      },
    });
  }
}
