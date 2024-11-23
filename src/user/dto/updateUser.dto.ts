import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'Имя должно быть строкой.' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Аватар должен быть строкой.' })
  avatar?: string;

  @IsOptional()
  @IsBoolean({message:'IsTwoFactorEnabled должен быть булевым значением.'})
  isTwoFactorEnabled:boolean

  @IsOptional()
  @IsString()
  code:string
} 
