import {UserDto} from "./User/UserDto";

export interface GameDto {
  id: number;
  player1: UserDto;
  player2: UserDto;
}
