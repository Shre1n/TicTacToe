import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import { UsersService } from '../users/users.service';
import { GamesService } from '../games/games.service';
import { QueueService } from '../queue/queue.service';
import { EloService } from '../elo/elo.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    AuthService,
    UsersService,
    GamesService,
    QueueService,
    EloService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
