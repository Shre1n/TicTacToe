import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { GamesService } from '../games/games.service';
import { QueueGateway } from './queue.gateway';

@Module({
  controllers: [],
  providers: [QueueService, GamesService, QueueGateway],
})
export class QueueModule {}
