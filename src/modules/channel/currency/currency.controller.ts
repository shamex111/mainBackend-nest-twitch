import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
} from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { Authorization } from 'src/modules/auth/decorators/auth.decorator';
import { Authorized } from 'src/modules/auth/decorators/authorized.decorator';
import { CreateCurrencyDto } from './dto/createCurrency.dto';
import { EditCurrencyDto } from './dto/editCurrency.dto';
import { CreateCurrencyBalanceDto } from './dto/CreateCurrencyBalance.dto';

@Controller('currencies')
export class CurrencyController {
  public constructor(private readonly currencyService: CurrencyService) {}

  @Authorization()
  @Post('create-currency')
  @HttpCode(HttpStatus.OK)
  public async create(
    @Authorized('id') userId: string,
    @Body() dto: CreateCurrencyDto,
  ) {
    return this.currencyService.createCurrency(dto, userId);
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
  @Post('create-currency-balance')
  @HttpCode(HttpStatus.OK)
  createCurrencyBalance(
    @Authorized('id') userId: string,
    @Body() dto: CreateCurrencyBalanceDto,
  ) {
    return this.currencyService.createCurrencyBalance(dto, userId);
  }
}
