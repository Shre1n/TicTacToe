import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions } from 'socket.io';
import { INestApplication } from '@nestjs/common';

export class SessionIoAdapter extends IoAdapter {
  constructor(
    private readonly middleware: any,
    app: INestApplication,
  ) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions): Server {
    const server = super.createIOServer(port, options);
    server.engine.use(this.middleware);
    return server;
  }
}
