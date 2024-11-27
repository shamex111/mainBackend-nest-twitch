import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { Authorization } from 'src/modules/auth/decorators/auth.decorator';
import { Authorized } from 'src/modules/auth/decorators/authorized.decorator';
import { CreateCurrencyDto } from './dto/createCurrency.dto';
import { EditCurrencyDto } from './dto/editCurrency.dto';
import { CreateCurrencyBalanceDto } from './dto/CreateCurrencyBalance.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('currencies')
export class CurrencyController {
  public constructor(private readonly currencyService: CurrencyService) {}

  @Authorization()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        files: 1,
      },
    }),
  )
  @Post('create-currency')
  @HttpCode(HttpStatus.OK)
  public async create(
    @Authorized('id') userId: string,
    @Body() dto: CreateCurrencyDto,
    @UploadedFile(
			new ParseFilePipe({
				validators: [
					new FileTypeValidator({
						fileType: /\/(jpg|jpeg|png|webp)$/
					}),
					new MaxFileSizeValidator({
						maxSize: 1000 * 1000 * 1,
						message: 'Можно загружать файлы не больше 1 МБ'
					})
				]
			})
		)
		file: Express.Multer.File
  ) {
    return this.currencyService.createCurrency(dto, userId,file);
  }

  @Authorization()
  @Delete('delete-currency')
  @HttpCode(HttpStatus.OK)
  public async delete(@Authorized('id') userId: string) {
    return this.currencyService.deleteCurrency(userId);
  }

  @Authorization()
  @Patch('edit-currency')
  @HttpCode(HttpStatus.OK)
  public async edit(
    @Authorized('id') userId: string,
    @Body() dto: EditCurrencyDto,
  ) {
    return this.currencyService.editCurrency(dto, userId);
  }

  @Authorization()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        files: 1,
      },
    }),
  )
  @Patch('edit-currency-image')
  @HttpCode(HttpStatus.OK)
  public async editImage(
    @Authorized('id') userId: string,
    @UploadedFile(
			new ParseFilePipe({
				validators: [
					new FileTypeValidator({
						fileType: /\/(jpg|jpeg|png|webp)$/
					}),
					new MaxFileSizeValidator({
						maxSize: 1000 * 1000 * 1,
						message: 'Можно загружать файлы не больше 1 МБ'
					})
				]
			})
		)
		file: Express.Multer.File

  ) {
    return this.currencyService.editCurrencyImage(userId,file);
  }

  @Authorization()
  @Post('create-currency-balance')
  @HttpCode(HttpStatus.OK)
  createCurrencyBalance(
    @Authorized('id') userId: string,
    @Body() dto: CreateCurrencyBalanceDto,
  ) {
    return this.currencyService.createCurrencyBalance(dto, userId);
  }
}
