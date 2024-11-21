import { IoAdapter } from '@nestjs/platform-socket.io';

export class MyIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: any): any {
    options = {
      ...options,
      cors: {
        origin: process.env.APP_URL,
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
      },
    };
    return super.createIOServer(port, options);
  }
}
