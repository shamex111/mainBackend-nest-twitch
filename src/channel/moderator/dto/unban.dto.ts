import { IsNotEmpty, IsString } from 'class-validator';

export class UnbanDto {
  @IsNotEmpty({ message: 'Поле userId не может быть пустым.' })
  @IsString({ message: 'Поле userId должно быть строкой.' })
  userId: string;

  @IsNotEmpty({ message: 'Поле streamerId не может быть пустым.' })
  @IsString({ message: 'Поле streamerId должно быть строкой.' })
  streamerId: string;
}
