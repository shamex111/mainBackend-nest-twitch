import { Body, Controller, HttpCode, HttpStatus, Patch, Post } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { Authorization } from 'src/auth/decorators/auth.decorator';
import { Authorized } from 'src/auth/decorators/authorized.decorator';
import { BuySubscriptionDto } from './dto/buySubscription.dto';
import { IPaymentStatus } from './interfaces/PaymentStatus.interface';
import { CreateUserSubscriptionDto } from './dto/createUserSubscription.dto';
import { ChangeUserSubscriptionDto } from './dto/changeUserSubscription.dto.dto';

@Controller('subscriptions')
export class SubscriptionController {
  public constructor(
    private readonly subscriptionService: SubscriptionService,
  ) {}

  @Authorization()
  @Post('create')
  @HttpCode(HttpStatus.OK)
  public async createUserSubscription(
    @Authorized('id') userId: string,
    @Body() dto: CreateUserSubscriptionDto,
  ) {
    return this.subscriptionService.createUserSubscription(userId, dto);
  }

  @Authorization()
  @Patch('change')
  @HttpCode(HttpStatus.OK)
  public async changeUserSubscription(
    @Authorized('id') userId: string,
    @Body() dto: ChangeUserSubscriptionDto,
  ) {
    return this.subscriptionService.changeUserSubscription(userId, dto);
  }

  @Authorization()
  @Post('buy-subscription')
  @HttpCode(HttpStatus.OK)
  public async buySubscription(
    @Authorized('id') userId: string,
    @Body() dto: BuySubscriptionDto,
  ) {
    return this.subscriptionService.buySubscription(userId, dto);
  }

  @Post('buy-subscription-status')
  @HttpCode(HttpStatus.OK)
  public async buySubscriptionStatus(@Body() dto: IPaymentStatus) {
    return this.subscriptionService.updatedBuyUserSubscriptionStatus(dto);
  }
}
