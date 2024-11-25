import { IsNotEmpty, IsString } from "class-validator";

export class AssignModeratorDto {
  @IsNotEmpty({ message: 'Поле userId не может быть пустым.' })
  @IsString({ message: 'Поле userId должно быть строкой.' })
  userId: string;
}
