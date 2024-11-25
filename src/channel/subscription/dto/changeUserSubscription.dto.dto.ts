import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class ChangeUserSubscriptionDto {
  @IsOptional()
  @IsInt()
  @Min(10, { message: 'Подписка не может стоить меньше 10 рублей.' })
  @Max(10000, { message: 'Подписка не может стоить больше 10000 рублей.' })
  price?: number;

  @IsOptional()
  @IsString({message:'Поле ввода icon должно быть строкой.'})
  icon?: string;
}
