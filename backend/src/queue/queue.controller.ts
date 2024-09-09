import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueueService } from './queue.service';
import { RolesGuard } from '../guards/roles/roles.guard';
import { QueueDto } from './dto/queue.dto';

@ApiTags('game')
@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @UseGuards(RolesGuard)
  @Get()
  @ApiOperation({ summary: 'Get the matchmaking queue' })
  @ApiOkResponse({ description: 'successful operation', type: QueueDto })
  async get() {
    return this.queueService.getQueue();
  }
}
