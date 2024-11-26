import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ChangeUserSubscriptionDto } from './dto/changeUserSubscription.dto.dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';
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
    const userSubscription =
      await this.prismaService.userSubscription.findFirst({
        where: { userId },
      });

    if (userSubscription)
      throw new ConflictException('У вас уже есть подписка пользователя.');

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

    return this.prismaService.$transaction(async (prisma) => {
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
        metadata: {
          userId,
          targetUserForSubscribeId: userSubscription.userId,
        },
      };

      const payment = await this.yookassaService.createPayment(paymentData);

      return payment;
    });
  }

  public async updatedBuyUserSubscriptionStatus(dto: IPaymentStatus) {
    try {
      if (dto.event === 'payment.waiting_for_capture') {
        const paymentId = dto.object.id;
        const paymentDetails =
          await this.yookassaService.getPaymentDetails(paymentId);

        if (!paymentDetails) {
          throw new NotFoundException(`Платеж c id:${paymentId} не найден.`);
        }

        const amount: Amount = paymentDetails.amount;

        const capturedPaymentDetails =
          await this.yookassaService.capturePayment(paymentId, amount);

        return capturedPaymentDetails;
      }

      if (dto.event === 'payment.succeeded') {
        const metadata = dto.object.metadata;
        const userId = metadata.userId;
        const targetUserForSubscribeId = metadata.targetUserForSubscribeId;

        const isExist = await this.prismaService.subscription.findFirst({
          where: {
            subscriberId: userId,
            subscribedId: targetUserForSubscribeId,
          },
        });

        if (isExist)
          throw new BadGatewayException(
            'Вы уже подписаны на данного пользователя',
          );

        await this.prismaService.subscription.create({
          data: {
            subscriberId: userId,
            subscribedId: targetUserForSubscribeId,
          },
        });

        await this.prismaService.user.update({
          where: {
            id: targetUserForSubscribeId,
          },
          data: {
            balance: {
              increment: +dto.object.amount.value,
            },
          },
        });
      }
      return true;
    } catch (error) {
      throw new BadRequestException('Ошибка при обработке статуса платежа');
    }
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
