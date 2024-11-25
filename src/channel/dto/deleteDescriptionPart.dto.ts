import { IsNotEmpty, IsString } from "class-validator";

export class DeleteDescriptionPartDto {
    @IsNotEmpty({message:'Поле descriptionPartId не может быть пустым.'})
    @IsString({message:'Поле descriptionPartId должно быть строкой.'})
    descriptionPartId:string
}
