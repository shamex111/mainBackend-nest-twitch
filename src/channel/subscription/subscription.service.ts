import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ChangeUserSubscriptionDto } from './dto/changeUserSubscription.dto.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserSubscriptionDto } from './dto/createUserSubscription.dto';
import { BuySubscriptionDto } from './dto/buySubscription.dto';
import {
  Amount,
  CurrencyEnum,
  PaymentCreateRequest,
  PaymentMethodsEnum,
  YookassaService,
} from 'nestjs-yookassa';
import { IPaymentStatus } from './interfaces/PaymentStatus.interface';

@Injectable()
export class SubscriptionService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly yookassaService: YookassaService,
  ) {}

  public async createUserSubscription(
    userId: string,
    dto: CreateUserSubscriptionDto,
  ) {
    const userSubscription =await this.findUserSubscription(userId);
    if (userSubscription)
      throw new NotFoundException('У вас уже есть подписка пользователя.');

    return this.prismaService.userSubscription.create({
      data: {
        userId,
        ...dto,
      },
    });
  }

  public async changeUserSubscription(
    userId: string,
    dto: ChangeUserSubscriptionDto,
  ) {
    if (Object.keys(dto).length === 0)
      throw new BadRequestException(
        'Нет данных для обновления.Пожалуйста, введите хоть какие-то изменения для изменния подписки пользователя.',
      );

      const userSubscription = await this.findUserSubscription(userId);
    if (!userSubscription)
      throw new NotFoundException(
        'Ваша подписка пользователя для изменения не найдена.',
      );
    return this.prismaService.userSubscription.update({
      where: {
        id: userSubscription.id,
      },
      data: {
        ...dto,
      },
    });
  }

  public async buySubscription(userId: string, dto: BuySubscriptionDto) {
    const userSubscription =
      await this.prismaService.userSubscription.findUnique({
        where: {
          id: dto.userSubscriptionId,
        },
        include: {
          user: true,
        },
      });
    if (!userSubscription)
      throw new NotFoundException('Подписка для покупки не найдена.');

    const isExist = await this.prismaService.subscription.findFirst({
      where: {
        subscriberId: userId,
        subscribedId: userSubscription.userId,
      },
    });
    if (isExist)
      throw new BadGatewayException('Вы уже подписаны на данного пользователя');

    const paymentData: PaymentCreateRequest = {
      amount: {
        value: userSubscription.price,
        currency: CurrencyEnum.RUB,
      },
      description: `Покупка подписки стримера ${userSubscription.user.name}`,
      payment_method_data: {
        type: PaymentMethodsEnum.bank_card,
      },
      confirmation: {
        type: 'redirect',
        return_url: dto.callbackUrl,
      },
    };

    return this.yookassaService.createPayment(paymentData);
  }

  public async updatedBuyUserSubscriptionStatus(dto: IPaymentStatus) {
    if (dto.event === 'payment.waiting_for_capture') {
      const paymentId = dto.object.id;

      const paymentDetails =
        await this.yookassaService.getPaymentDetails(paymentId);

      if (!paymentDetails) {
        throw new NotFoundException(`Платеж c id:${paymentId} не найден.`);
      }

      const amount: Amount = paymentDetails.amount;

      const capturedPaymentDetails = await this.yookassaService.capturePayment(
        paymentId,
        amount,
      );

      return capturedPaymentDetails;
    }
    if (dto.event === 'payment.succeeded') {
      const descriptionParts = dto.object.description.split(', ');
      const userId = descriptionParts[0].split('#')[1];
      const targetUserForSubscribeId = descriptionParts[1].split('#')[1];

      return this.prismaService.subscription.create({
        data: {
          subscriberId: userId,
          subscribedId: targetUserForSubscribeId,
        },
      });
    }
    return true;
  }

  private async findUserSubscription(userId: string) {
    const subscription = await this.prismaService.userSubscription.findFirst({
      where: { userId },
    });

    if (!subscription) {
      throw new NotFoundException('Подписка пользователя не найдена.');
    }

    return subscription;
  }
}
