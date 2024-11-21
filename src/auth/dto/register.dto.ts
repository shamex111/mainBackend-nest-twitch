import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Validate,
} from 'class-validator';
import { IsPasswordsMatchConstraint } from 'src/libs/common/decorators/is-passwords-constraint.decorator';
export class RegisterDto {
  @IsNotEmpty({ message: 'Поле ввода email не может быть пустым.' })
  @IsEmail(
    {},
    { message: 'Поле ввода email имеет неправильный формат написания.' },
  )
  @IsString({ message: 'Поле ввода email должно быть строкой.' })
  email: string;

  @IsNotEmpty({ message: 'Поле ввода имени не может быть пустым.' })
  @IsString({ message: 'Поле ввода имени должно быть строкой.' })
  name: string;

  @IsNotEmpty({ message: 'Поле ввода пароля не может быть пустым.' })
  @IsString({ message: 'Поле ввода пароля должно быть строкой.' })
  @MinLength(8, {
    message: 'Пароль должен иметь минимальную длину 8 символов.',
  })
  password: string;

  @IsNotEmpty({ message: 'Поле ввода пароля не может быть пустым.' })
  @IsString({ message: 'Поле ввода пароля должно быть строкой.' })
  @MinLength(8, {
    message: 'Пароль должен иметь минимальную длину 8 символов.',
  })
  @Validate(IsPasswordsMatchConstraint, {
    message: 'Пароли не совпадают.',
  })
  passwordRepeat: string;
}
