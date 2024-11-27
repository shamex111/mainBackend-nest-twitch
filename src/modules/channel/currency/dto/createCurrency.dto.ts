import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCurrencyDto {
  @IsNotEmpty({ message: 'Поле name не может быть пустым.' })
  @IsString({ message: 'Поле name должно быть строкой.' })
  @MaxLength(18,{message:'Поле name не должно быть длинее 18 символов.'})
  name: string;

}
