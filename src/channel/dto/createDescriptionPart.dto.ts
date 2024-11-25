import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateDescriptionPartDto {
  @IsNotEmpty({message:'Поле image не может быть пустым.'})
  @IsString({message:'Поле image должно быть строкой.'})
  image: string;

  @IsString({message:'Поле description должно быть строкой.'})
  @MaxLength(128,{message:'Поле name не должно быть длинее 128 символов.'})
  description: string;

  @IsNotEmpty({message:'Поле url не может быть пустым.'})
  @IsString({message:'Поле url должно быть строкой.'})
  url: string;
}
