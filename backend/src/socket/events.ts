import { GameDto } from '../games/dto/game.dto';
import { GameUpdateDto } from '../games/dto/gameUpdate.dto';
import { MoveDto } from '../games/dto/move.dto';

export enum ClientSentEvents {
  enterQueue = 'enterQueue',
  leaveQueue = 'leaveQueue',
  makeMove = 'makeMove',
  gameFoundAcknowledged = 'gameFoundAcknowledged',
  sendMessage = 'sendMessage',
}

export enum ServerSentEvents {
  gameFound = 'gameFound',
  gameStarted = 'gameStarted',
  moveMade = 'moveMade',
  receiveMessage = 'receiveMessage',
}

export interface ClientToServerEvents {
  enterQueue: () => void;
  leaveQueue: () => void;
  makeMove: (move: MoveDto) => void;
  gameFoundAcknowledged: () => void;
  sendMessage: () => void;
}

export interface ServerToClientEvents {
  gameFound: () => void;
  gameStarted: (game: GameDto) => void;
  moveMade: (update: GameUpdateDto) => void;
  receiveMessage: () => void;
}
