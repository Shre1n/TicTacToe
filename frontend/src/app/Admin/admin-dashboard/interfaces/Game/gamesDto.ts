import {UserDto} from "../../../../User/player-profile/player-content/userDto";
import {ChatDTO} from "../../../../Site-View/chat/dto/chat.dto";


export interface GameDto {
  board: number[];
  player1: UserDto;
  player2: UserDto;
  winner: string;
  turn: number;
  chat: ChatDTO[];
}
