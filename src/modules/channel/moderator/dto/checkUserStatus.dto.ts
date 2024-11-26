import { IsNotEmpty, IsString } from 'class-validator';

export class CheckUserStatusDto {
  @IsNotEmpty({ message: 'Поле userId не может быть пустым.' })
  @IsString({ message: 'Поле userId должно быть строкой.' })
  streamerId: string;

}
