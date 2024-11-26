import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendPasswordDto {
  @IsNotEmpty({message:'Поле email не может быть пустым.'})
  @IsString({ message: 'Поле email должно быть строкой.' })
  @IsEmail({}, { message: 'Поле email должно быть корректного формата.' })
  email: string;
}
