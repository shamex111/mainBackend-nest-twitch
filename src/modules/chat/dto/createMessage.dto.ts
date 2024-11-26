import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty({ message: 'Поле chatId не может быть пустым.' })
  @IsString({ message: 'Поле chatId должно быть строкой.' })
  chatId: string;

  @IsNotEmpty({ message: 'Поле content не может быть пустым.' })
  @IsString({ message: 'Поле content должно быть строкой.' })
  @MaxLength(512, { message: 'Максимальная длина сообщения 512 символов.' })
  content: string;

  @IsOptional()
  @IsString({ message: 'Поле replyMessageId должно быть строкой.' })
  replyMessageId?: string;
}
