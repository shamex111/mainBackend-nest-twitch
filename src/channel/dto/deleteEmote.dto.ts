import { IsNotEmpty, IsString } from "class-validator";

export class DeleteEmoteDto {
    @IsNotEmpty({message:'Поле id не может быть пустым.'})
    @IsString({message:'Поле id должно быть строкой.'})
    id:string
}
