import { Controller, Delete, Get, Session, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SessionData } from 'express-session';
import { QueueService } from './queue.service';
import { RolesGuard } from '../guards/roles/roles.guard';
import { QueueDto } from './dto/queue.dto';

@ApiTags('matchmaking')
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

  //@UseGuards(IsLoggedInGuard)
  @Delete()
  @ApiOperation({
    summary: 'Removes the player from the matchmaking queue.',
    description:
      'The player is removed from the matchmaking queue. The user needs to be logged in.',
  })
  @ApiOkResponse({ description: 'Successful operation' })
  async leave(@Session() session: SessionData) {
    this.queueService.removePlayer(session.user);
  }
}
