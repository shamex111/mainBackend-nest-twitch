import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateEmoteDto {
  @IsNotEmpty({ message: 'Поле image не может быть пустым.' })
  @IsString({ message: 'Поле image должно быть строкой.' })
  image: string;

  @MaxLength(18,{message:'Поле name не должно быть длинее 18 символов.'})
  @IsNotEmpty({ message: 'Поле name не может быть пустым.' })
  @IsString({ message: 'Поле name должно быть строкой.' })
  name: string;
}
// image = uuidUser + emoteName + explore
// tag = uuidUser + emoteName
