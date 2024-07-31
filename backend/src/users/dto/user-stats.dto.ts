import { ApiProperty } from '@nestjs/swagger';

export class UserStatsDto {
  @ApiProperty({ description: 'The number of wins', example: 25 })
  wins: number;

  @ApiProperty({ description: 'The number of loses', example: 22 })
  loses: number;

  @ApiProperty({ description: 'The number of draws', example: 6 })
  draws: number;
}
