import { UserDto } from '../../User/interfaces/userDto';

export interface MatchUpDto {
  gameId: number;
  opponent: UserDto;
}
