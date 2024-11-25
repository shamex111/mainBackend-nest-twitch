import { IsNotEmpty, IsString } from "class-validator";

export class UnfollowDto {
    @IsNotEmpty({message:'streamerId не может быть пустым.'})
    @IsString({message:'streamerId должен быть строкой.'})
    streamerId:string
}
