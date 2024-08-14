import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { Game } from './games.entity';
import { GamesGateway } from './games.gateway';
import {EloService} from "../elo/elo.service";

@Module({
  imports: [TypeOrmModule.forFeature([Game])],
  providers: [GamesService, GamesGateway, EloService],
  controllers: [GamesController],
})
export class GamesModule {}
