import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangeEmailDto {
  @IsNotEmpty({ message: 'Поле ввода newEmail не может быть пустым.' })
  @IsEmail( {}, { message: 'Поле ввода newEmail имеет неправильный формат написания.' })
  @IsString({ message: 'Поле ввода newEmail должно быть строкой.' })
  newEmail: string;

  @IsNotEmpty({ message: 'Поле token не может быть пустым.' })
  @IsString({ message: 'Поле token должно быть строкой.' })
  token: string;
}
