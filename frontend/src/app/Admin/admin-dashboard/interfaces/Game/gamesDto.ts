import {UserDto} from "./User/userDto";

export interface GameDto {
  gameId: number;
  board: number[];
  player1: UserDto;
  player2: UserDto;
  winner: string;
}
