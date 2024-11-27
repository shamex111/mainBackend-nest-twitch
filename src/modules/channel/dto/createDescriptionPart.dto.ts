import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateDescriptionPartDto {

  @IsString({message:'Поле description должно быть строкой.'})
  @MaxLength(128,{message:'Поле name не должно быть длинее 128 символов.'})
  description: string;

  @IsNotEmpty({message:'Поле url не может быть пустым.'})
  @IsString({message:'Поле url должно быть строкой.'})
  url: string;
}
