import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { GamesService } from '../games/games.service';
import { QueueGateway } from './queue.gateway';
import {EloService} from "../elo/elo.service";

@Module({
  controllers: [],
  providers: [QueueService, GamesService, QueueGateway, EloService],
})
export class QueueModule {}
