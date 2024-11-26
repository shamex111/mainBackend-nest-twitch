import { IsNotEmpty, IsString } from "class-validator";

export class CreateCurrencyBalanceDto{
    @IsNotEmpty({message:'Поле streamerCurrencyId не может быть пустым.'})
    @IsString({message:'Поле streamerCurrencyId должно быть строкой.'})
    streamerCurrencyId:string   
}