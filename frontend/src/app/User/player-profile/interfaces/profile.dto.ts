import { MatchDto } from '../../../Game/interfaces/matchDto';
import { UserStatsDto } from './user-stats.dto';

export interface ProfileDto {
  stats: UserStatsDto;
  matchHistory: MatchDto[];
}
