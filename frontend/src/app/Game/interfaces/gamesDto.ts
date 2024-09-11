import {UserDto} from "../../User/interfaces/userDto";
import {ChatDTO} from "../chat/dto/chat.dto";


export interface GameDto {
  board: number[];
  player1: UserDto;
  player2: UserDto;
  winner: string;
  turn: number;
  isFinished: boolean;
  chat: ChatDTO[];
  playerIdentity: 0 | 1| 2;
}
