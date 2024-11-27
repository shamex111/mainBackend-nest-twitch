import {  Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class CreateUserSubscriptionDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Цена подписки должна быть целым числом.' })
  @Min(10, { message: 'Подписка не может стоить меньше 10 рублей.' })
  @Max(10000, { message: 'Подписка не может стоить больше 10000 рублей.' })
  price?: number;
}
