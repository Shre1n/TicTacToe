import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { ProfilePicture } from '../profilePicture/profilePicture.entity';
import { UsersController } from './users.controller';
import { ProfilePictureService } from '../profilePicture/profilePicture.service';
import { EloService } from '../elo/elo.service';
import { QueueModule } from '../queue/queue.module';
import { GamesModule } from '../games/games.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ProfilePicture]),
    QueueModule,
    GamesModule,
  ],
  providers: [UsersService, ProfilePictureService, EloService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
