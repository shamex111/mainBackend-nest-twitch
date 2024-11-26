import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import { getSessionConfig } from './core/config/session.config';
import { getCorsConfig } from './core/config/cors.config';
import { getGlobalPipeConfig } from './core/config/globalPipe.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')));

  app.useGlobalPipes(new ValidationPipe(getGlobalPipeConfig(config)));

  app.use(session(getSessionConfig(config)));

  app.setGlobalPrefix(config.getOrThrow<string>('SERVER_PREFIX'));

  app.enableCors(getCorsConfig(config));

  await app.listen(config.getOrThrow<number>('APP_PORT'));
}
bootstrap();
