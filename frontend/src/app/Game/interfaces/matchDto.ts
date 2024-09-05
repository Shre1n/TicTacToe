import { UserDto } from '../../User/interfaces/userDto';

export interface MatchDto {
  player: UserDto;
  playerIdentity: 1 | 2;
  opponent: UserDto;
  board: number[];
  outcome: GameResult;
  duration: number;
  createdAt: Date;
  eloGain: number;
}

export enum GameResult {
  Self = 'self',
  Opponent = 'opponent',
  Draw = 'draw',
}
