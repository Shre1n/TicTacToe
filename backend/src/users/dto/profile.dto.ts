import { ApiProperty } from '@nestjs/swagger';
import { UserStatsDto } from './user-stats.dto';
import { MatchDto } from '../../games/dto/match.dto';
import { User } from '../users.entity';

export class ProfileDto {
  @ApiProperty({ description: 'The username of the user', example: 'john_doe' })
  username: string;

  @ApiProperty({
    description: 'The profile picture id of the user',
    nullable: true,
  })
  profilePictureId: number;

  @ApiProperty({ description: 'The Elo rating of the user', example: 1500 })
  elo: number;

  @ApiProperty({ description: 'The game stats of the user' })
  stats: UserStatsDto;

  @ApiProperty({
    description: 'The match history of the user',
    type: [MatchDto],
  })
  matchHistory: MatchDto[];

  static from(
    user: User,
    stats: UserStatsDto,
    matchHistory: MatchDto[],
  ): ProfileDto {
    const { username, elo, profilePicture } = user;
    return { username, elo, profilePictureId: profilePicture?.id, stats, matchHistory };
  }
}
