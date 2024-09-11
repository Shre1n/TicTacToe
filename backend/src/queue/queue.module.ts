import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { QueueGateway } from './queue.gateway';
import { QueueController } from './queue.controller';
import { EloService } from '../elo/elo.service';
import { GamesModule } from '../games/games.module';

@Module({
  imports: [GamesModule],
  controllers: [QueueController],
  providers: [QueueService, QueueGateway, EloService],
  exports: [QueueService, QueueGateway],
})
export class QueueModule {}
