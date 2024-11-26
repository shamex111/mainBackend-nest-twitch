import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateUserSubscriptionDto {
  @IsOptional()
  @IsInt({message:'Цена подписки должна быть целым числом.'})
  @Min(10, { message: 'Подписка не может стоить меньше 10 рублей.' })
  @Max(10000, { message: 'Подписка не может стоить больше 10000 рублей.' })
  price?: number;

  @IsOptional()
  @IsString({ message: 'Поле ввода icon должно быть строкой.' })
  icon?: string;
}
