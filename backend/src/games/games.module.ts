import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesService } from './games.service';
import { GamesController } from './gamesController';
import { Game } from './games.entity';
import { GamesGateway } from './gamesGateway';

@Module({
  imports: [TypeOrmModule.forFeature([Game])],
  providers: [GamesService, GamesGateway],
  controllers: [GamesController],
})
export class GamesModule {}
