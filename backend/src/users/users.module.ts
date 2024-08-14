import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { ProfilePicture } from '../profilePicture/profilePicture.entity';
import { UsersController } from './users.controller';
import { ProfilePictureService } from '../profilePicture/profilePicture.service';
import { GamesService } from '../games/games.service';
import { QueueService } from '../queue/queue.service';
import { EloService } from '../elo/elo.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, ProfilePicture])],
  providers: [
    UsersService,
    ProfilePictureService,
    GamesService,
    QueueService,
    EloService,
  ],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
