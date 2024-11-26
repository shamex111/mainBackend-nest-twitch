import { ConfigService } from '@nestjs/config';

export const getCorsConfig = (configService: ConfigService) => ({
  origin: configService.getOrThrow<string>('ALLOWED_ORIGIN'),
  credentials: true,
  exposedHeaders: ['set-cookie'],
});
