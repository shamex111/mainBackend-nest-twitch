import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  Validate,
} from 'class-validator';
import { AuthMethod } from 'prisma/__generated__';
import { IsPasswordsMatchConstraint } from 'src/libs/common/decorators/is-passwords-constraint.decorator';
export class UserCreateDto {
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

  @IsNotEmpty({ message: 'Метод регистрации не может быть пустым.' })
  @IsEnum(AuthMethod, { message: 'Метод регистрации не может быть пустым.' })
  method: AuthMethod;

  @IsOptional()
  isVerified?:boolean
}
