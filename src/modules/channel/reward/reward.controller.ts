import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { RewardService } from './reward.service';
import { Authorization } from 'src/modules/auth/decorators/auth.decorator';
import { Authorized } from 'src/modules/auth/decorators/authorized.decorator';
import { CreateRewardDto } from './dto/createReward.dto';
import { DeleteRewardDto } from './dto/deleteReward.dto';
import { BuyRewardDto } from './dto/buyReward.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('rewards')
export class RewardController {
  public constructor(private readonly rewardService: RewardService) {}

  @Authorization()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        files: 1,
      },
    }),
  )
  @Post('create')
  @HttpCode(HttpStatus.OK)
  public async create(
    @Authorized('id') userId: string,
    @Body() dto: CreateRewardDto,
    @UploadedFile(
			new ParseFilePipe({
				validators: [
					new FileTypeValidator({
						fileType: /\/(jpg|jpeg|png|webp)$/
					}),
					new MaxFileSizeValidator({
						maxSize: 1000 * 1000 * 3,
						message: 'Можно загружать файлы не больше 3 МБ'
					})
				]
			})
		)
		file: Express.Multer.File
  ) {
    return this.rewardService.createReward(dto, userId,file);
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
