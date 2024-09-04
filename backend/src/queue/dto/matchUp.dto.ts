import { UserDto } from '../../users/dto/user.dto';

export class MatchUpDto {
  opponent: UserDto;
  gameId: number;
}
