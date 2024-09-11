import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { SessionData } from 'express-session';
import { QueueService } from '../queue/queue.service';
import { QueueGateway } from '../queue/queue.gateway';
import { ServerSentEvents } from '../socket/events';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private queueService: QueueService,
    private queueGateWay: QueueGateway,
  ) {}

  async login(username: string, password: string) {
    const user = await this.usersService.findOne(username);
    if (!user) throw new ForbiddenException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new ForbiddenException('Invalid credentials');

    return user;
  }

  async logout(session: SessionData) {
    this.queueService.removePlayer(session.user);
    this.queueGateWay.server.to('admin').emit(ServerSentEvents.queueUpdated);
    session.destroy(() => {
      return {
        message: 'Logout successful',
        statusCode: HttpStatus.OK,
      };
    });
  }
}
