import { ApiProperty } from '@nestjs/swagger';
import { QueueObject } from '../queueObject';

export class QueueEntryDto {
  @ApiProperty({
    description: 'Username of the waiting player',
    example: 'john_doe',
  })
  username: string;

  @ApiProperty({ description: 'Elo of the waiting player', example: 1000 })
  elo: number;

  @ApiProperty({ description: 'Time the player entered the matchmaking queue' })
  entryTime: Date;

  static from(queueObject: QueueObject): QueueEntryDto {
    return {
      username: queueObject.player.username,
      elo: queueObject.player.elo,
      entryTime: queueObject.entryTime,
    };
  }
}
