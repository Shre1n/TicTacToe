import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { GameService } from '../games/logic/game/game.service';
import { QueueGateway } from './queue.gateway';

@Module({
  controllers: [],
  providers: [QueueService, GameService, QueueGateway],
})
export class QueueModule {}
