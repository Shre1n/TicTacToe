import { ApiProperty } from '@nestjs/swagger';
import { UserStatsDto } from './user-stats.dto';
import { MatchDto } from '../../games/dto/match.dto';

export class ProfileDto {
  @ApiProperty({ description: 'The game stats of the user' })
  stats: UserStatsDto;

  @ApiProperty({
    description: 'The match history of the user',
    type: [MatchDto],
  })
  matchHistory: MatchDto[];

  static from(stats: UserStatsDto, matchHistory: MatchDto[]): ProfileDto {
    return {
      stats,
      matchHistory,
    };
  }
}
