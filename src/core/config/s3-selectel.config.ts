import { ConfigService } from "@nestjs/config";

export const getS3SelectelConfig = (configService:ConfigService) => ({
    endpoint: configService.getOrThrow<string>('S3_ENDPOINT'),
    region: configService.getOrThrow<string>('S3_REGION'),
    credentials: {
      accessKeyId: configService.getOrThrow<string>('S3_ACCESS_KEY_ID'),
      secretAccessKey: configService.getOrThrow<string>(
        'S3_SECRET_ACCESS_KEY',
      ),
    },
  })