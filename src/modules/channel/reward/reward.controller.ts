import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { RewardService } from './reward.service';
import { Authorization } from 'src/modules/auth/decorators/auth.decorator';
import { Authorized } from 'src/modules/auth/decorators/authorized.decorator';
import { CreateRewardDto } from './dto/createReward.dto';
import { DeleteRewardDto } from './dto/deleteReward.dto';
import { BuyRewardDto } from './dto/buyReward.dto';

@Controller('rewards')
export class RewardController {
  public constructor(private readonly rewardService: RewardService) {}

  @Authorization()
  @Post('create')
  @HttpCode(HttpStatus.OK)
  public async create(
    @Authorized('id') userId: string,
    @Body() dto: CreateRewardDto,
  ) {
    return this.rewardService.createReward(dto, userId);
  }

  @Authorization()
  @Delete('delete')
  @HttpCode(HttpStatus.OK)
  public async delete(
    @Authorized('id') userId: string,
    @Body() dto: DeleteRewardDto,
  ) {
    return this.rewardService.deleteReward(dto, userId);
  }

  @Authorization()
  @Post('buy-reward')
  @HttpCode(HttpStatus.OK)
  public async buyReward(
    @Authorized('id') userId: string,
    @Body() dto: BuyRewardDto,
  ) {
    return this.rewardService.buyReward(dto, userId);
  }
}
