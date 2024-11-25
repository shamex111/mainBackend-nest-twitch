import { IsNotEmpty, IsString } from "class-validator";

export class UnpinnedMessageDto {
  @IsNotEmpty({ message: 'Поле messageId не может быть пустым.' })
  @IsString({ message: 'Поле messageId должно быть строкой.' })
  messageId: string;
}
