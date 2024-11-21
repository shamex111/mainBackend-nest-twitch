import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmationDto {
  @IsNotEmpty({ message: 'Поле token не может быть пустым.' })
  @IsString({ message: 'Поле token должно быть строкой.' })
  token: string;
}
