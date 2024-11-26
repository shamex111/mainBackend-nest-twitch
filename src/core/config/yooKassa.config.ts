import { ConfigService } from "@nestjs/config";

export const getYooKassaConfig = (configService: ConfigService) => ({
    shopId:configService.getOrThrow<string>("SHOP_ID"),
    apiKey:configService.getOrThrow<string>("PAYMENT_TOKEN"),
});
