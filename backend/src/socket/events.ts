import { GameUpdateDto } from '../games/dto/gameUpdate.dto';
import { MoveDto } from '../games/dto/move.dto';
import { ChatDto } from '../games/chat/dto/chat.dto';
import { MatchUpDto } from '../queue/dto/matchUp.dto';

export enum ClientSentEvents {
  enterQueue = 'enterQueue',
  leaveQueue = 'leaveQueue',
  makeMove = 'makeMove',
  gameFoundAcknowledged = 'gameFoundAcknowledged',
  sendMessage = 'sendMessage',
  sendGiveUp = 'sendGiveUp',
}

export enum ServerSentEvents {
  gameFound = 'gameFound',
  gameStarted = 'gameStarted',
  moveMade = 'moveMade',
  receiveMessage = 'receiveMessage',
  receiveGiveUp = 'receiveGiveUp',
}

export interface ClientToServerEvents {
  enterQueue: () => void;
  leaveQueue: () => void;
  sendGiveUp: (id: number) => void;
  makeMove: (move: MoveDto) => void;
  gameFoundAcknowledged: () => void;
  sendMessage: (message: ChatDto) => void;
}

export interface ServerToClientEvents {
  gameFound: () => void;
  receiveGiveUp: (id: number) => void;
  gameStarted: (matchUp: MatchUpDto) => void;
  moveMade: (update: GameUpdateDto) => void;
  receiveMessage: () => void;
}
