import {
  Body,
  Controller,
  FileTypeValidator,
  FileValidator,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { Authorization } from 'src/modules/auth/decorators/auth.decorator';
import { Authorized } from 'src/modules/auth/decorators/authorized.decorator';
import { BuySubscriptionDto } from './dto/buySubscription.dto';
import { IPaymentStatus } from './interfaces/PaymentStatus.interface';
import { CreateUserSubscriptionDto } from './dto/createUserSubscription.dto';
import { ChangeUserSubscriptionDto } from './dto/changeUserSubscription.dto.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('subscriptions')
export class SubscriptionController {
  public constructor(
    private readonly subscriptionService: SubscriptionService,
  ) {}
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
  public async createUserSubscription(
    @Authorized('id') userId: string,
    @Body() dto: CreateUserSubscriptionDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: /\/(jpg|jpeg|png|webp)$/,
          }),
          new MaxFileSizeValidator({
            maxSize: 1000 * 1000 * 2,
            message: 'Можно загружать файлы не больше 2 МБ',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.subscriptionService.createUserSubscription(userId, dto, file);
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
	@UseInterceptors(
		FileInterceptor('file', {
			limits: {
				files: 1
			}
		})
	)
	@Patch('change-icon')
	@HttpCode(HttpStatus.OK)
	public async changeIcon(
		@Authorized('id') userId: string,
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new FileTypeValidator({
						fileType: /\/(jpg|jpeg|png|webp)$/
					}),
					new MaxFileSizeValidator({
						maxSize: 1000 * 1000 * 2,
						message: 'Можно загружать файлы не больше 2 МБ'
					})
				]
			})
		)
		file: Express.Multer.File
	) {
		return this.subscriptionService.changeUserSubscriptionAvatar(userId, file)
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
