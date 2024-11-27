import { IsOptional, IsString, MaxLength } from 'class-validator';

export class EditCurrencyDto {
  @IsOptional()
  @IsString({message:'Поле name должно быть строкой.'})
  @MaxLength(18,{message:'Поле name не должно быть длинее 18 символов.'})
  name?: string;

}
