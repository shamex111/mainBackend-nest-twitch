import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ResetTwoFactorAuthDto {
  @IsNotEmpty({ message: 'Поле ввода email не должно быть пустым.' })
  @IsString({ message: 'Поле ввода email должно быть типом строки.' })
  @IsEmail({}, { message: 'Поле ввода email должно быть корректного фората.' })
  email: string;
}
