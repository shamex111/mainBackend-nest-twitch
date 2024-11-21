import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class NewPasswordDto {
  @IsNotEmpty({ message: 'Поле password не может быть пустым.' })
  @IsString({ message: 'Поле password должно быть строкой.' })
  @MinLength(8,{message:'Минимальная длина пароля 8 символов.'})
  newPassword: string;

  @IsNotEmpty({ message: 'Поле token не может быть пустым.' })
  @IsString({ message: 'Поле token должно быть строкой.' })
  token:string
}
