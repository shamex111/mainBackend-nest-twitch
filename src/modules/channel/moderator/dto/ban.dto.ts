import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { banAction } from 'src/core/prisma/__generated__';
import { Type } from 'class-transformer';
export class BanDto {
  @IsNotEmpty({ message: 'Поле streamerId не может быть пустым.' })
  @IsString({ message: 'Поле streamerId должно быть строкой.' })
  streamerId: string;

  @IsNotEmpty({ message: 'Поле userId не может быть пустым.' })
  @IsString({ message: 'Поле userId должно быть строкой.' })
  userId: string;

  @IsNotEmpty({ message: 'Поле reason не может быть пустым.' })
  @IsString({ message: 'Поле reason должно быть строкой.' })
  @MaxLength(256, {
    message: 'Макс.длина причины назначения ограничений 256 символов.',
  })
  reason: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Поле expiresAt должно быть типом даты.' })
  expiresAt?: Date;

  @IsNotEmpty({ message: 'Поле action не может быть пустым.' })
  @IsEnum(banAction, {
    message: 'Поле action должно содержать либо MUTE либо BAN',
  })
  action: banAction;
}
