import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { MyIoAdapter } from './my-io.adapter';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  const config = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.setGlobalPrefix(config.getOrThrow<string>('SERVER_PREFIX'));

  app.enableCors({
    origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
    credentials: true,
  });

  app.useWebSocketAdapter(new MyIoAdapter(app));
  await app.listen(config.getOrThrow<number>('APP_PORT'));
}
bootstrap();
