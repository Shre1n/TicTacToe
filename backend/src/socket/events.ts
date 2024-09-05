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
}

export enum ServerSentEvents {
  gameFound = 'gameFound',
  gameStarted = 'gameStarted',
  moveMade = 'moveMade',
  receiveMessage = 'receiveMessage',
  queueUpdated = 'queueUpdated',
  runningGamesUpdated = 'runningGamesUpdated',
}

export interface ClientToServerEvents {
  enterQueue: () => void;
  leaveQueue: () => void;
  makeMove: (move: MoveDto) => void;
  gameFoundAcknowledged: () => void;
  sendMessage: (message: ChatDto) => void;
}

export interface ServerToClientEvents {
  gameFound: () => void;
  gameStarted: (matchUp: MatchUpDto) => void;
  moveMade: (update: GameUpdateDto) => void;
  receiveMessage: () => void;
  queueUpdated: () => void;
  runningGamesUpdated: () => void;
}
