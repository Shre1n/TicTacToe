import { ApiProperty } from '@nestjs/swagger';
import { ProfilePicture } from '../../profilePicture/profilePicture.entity';
import { UserStatsDto } from './user-stats.dto';
import { MatchDto } from '../../games/dto/match.dto';
import { User } from '../users.entity';

export class ProfileDto {
  @ApiProperty({ description: 'The username of the user', example: 'john_doe' })
  username: string;

  @ApiProperty({
    description: 'The profile picture of the user',
    type: () => ProfilePicture,
    nullable: true,
  })
  profilePicture: ProfilePicture;

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
    return { username, elo, profilePicture, stats, matchHistory };
  }
}
