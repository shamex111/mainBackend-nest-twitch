import { IsNotEmpty, IsString } from "class-validator";

export class DeleteRewardDto {
    @IsNotEmpty({ message: 'Поле userRewardId не может быть пустым.' })
    @IsString({ message: 'Поле userRewardId должно быть строкой.' })
    userRewardId:string
}