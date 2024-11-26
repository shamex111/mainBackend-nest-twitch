import { IsNotEmpty, IsString } from "class-validator";

export class BuySubscriptionDto{
    @IsNotEmpty({message:'Поле ввода userSubscriptionId не может быть пустым.'})
    @IsString({message:'Поле ввода userSubscriptionId должно быть строкой.'})
    userSubscriptionId:string;

    @IsNotEmpty({message:'Поле ввода callbackUrl не может быть пустым.'})
    @IsString({message:'Поле ввода callbackUrl должно быть строкой.'})
    callbackUrl:string
}