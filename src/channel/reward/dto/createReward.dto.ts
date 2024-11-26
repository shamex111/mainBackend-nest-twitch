import {
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  Min,
  Max,
  IsOptional,
} from 'class-validator';

export class CreateRewardDto {
  @IsOptional()
  @IsString({ message: 'Поле image должно быть строкой.' })
  image?: string;

  @IsNotEmpty({ message: 'Поле name не может быть пустым.' })
  @IsString({ message: 'Поле name должно быть строкой.' })
  @MaxLength(24, { message: 'Поле name не должно быть длинее 24 символов.' })
  name: string;

  @IsString({ message: 'Поле description должно быть строкой.' })
  @MaxLength(72, {
    message: 'Поле description не должно быть длинее 72 символов.',
  })
  description: string;

  @IsNotEmpty({ message: 'Поле ввода price не может быть пустым.' })
  @IsInt({ message: 'price награды должна быть целым числом.' })
  @Min(1, { message: 'Цена должна быть хотя бы 1.' })
  @Max(1000000, { message: 'Цена не может быть больше миллиона.' })
  price: number;
}
