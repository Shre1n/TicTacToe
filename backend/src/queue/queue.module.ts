import { Module } from '@nestjs/common';
import { QueueController } from './queue.controller';
import { QueueService } from './queue.service';
import { GameService } from '../games/logic/game/game.service';

@Module({
  controllers: [QueueController],
  providers: [QueueService, GameService],
})
export class QueueModule {}
