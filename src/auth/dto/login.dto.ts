import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Поле ввода email не может быть пустым.' })
  @IsEmail(
    {},
    { message: 'Поле ввода email имеет неправильный формат написания.' },
  )
  @IsString({ message: 'Поле ввода email должно быть строкой.' })
  email: string;

  @IsNotEmpty({ message: 'Поле ввода пароля не может быть пустым.' })
  @IsString({ message: 'Поле ввода пароля должно быть строкой.' })
  @MinLength(8, {
    message: 'Пароль должен иметь минимальную длину 8 символов.',
  })
  password: string;

  @IsOptional()
  @IsString()
  code:string
}
