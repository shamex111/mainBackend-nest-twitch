import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @MinLength(1, { message: 'Минимальная длина имени 1 символ.' })
  @MaxLength(18,{message:'Поле name не должно быть длинее 18 символов.'})
  @IsString({ message: 'Имя должно быть строкой.' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Описание должен быть строкой.' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'Баннер должен быть строкой.' })
  banner?: string;

  @IsOptional()
  @IsString({ message: 'Цвет должен быть строкой.' })
  color?: string;

  @IsOptional()
  @IsBoolean({ message: 'IsTwoFactorEnabled должен быть булевым значением.' })
  isTwoFactorEnabled: boolean;

  @IsOptional()
  @IsString({message:'Код 2-ой аутентификации должен быть строкой.'})
  code: string;
}
