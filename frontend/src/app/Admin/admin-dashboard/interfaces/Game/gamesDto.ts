import {UserDto} from "../../../../User/player-profile/player-content/userDto";


export interface GameDto {
  gameId: number;
  board: number[];
  player1: UserDto;
  player2: UserDto;
  winner: string;
  turn: number;
}
