import { ConfigService } from '@nestjs/config';

export const getGlobalPipeConfig = (configService: ConfigService) => ({
  whitelist: true,
  transform: true,
});
