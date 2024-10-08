import { GameUpdateDto } from '../games/dto/gameUpdate.dto';
import { MoveDto } from '../games/dto/move.dto';
import { ChatDto } from '../games/chat/dto/chat.dto';
import { UserDto } from '../users/dto/user.dto';
import { SpectateDto } from '../games/dto/spectate.dto';

export enum ClientSentEvents {
  enterQueue = 'enterQueue',
  leaveQueue = 'leaveQueue',
  makeMove = 'makeMove',
  gameFoundAcknowledged = 'gameFoundAcknowledged',
  sendMessage = 'sendMessage',
  sendGiveUp = 'sendGiveUp',
  enterSpectate = 'enterSpectate',
  leaveSpectate = 'leaveSpectate',
}

export enum ServerSentEvents {
  gameFound = 'gameFound',
  gameStarted = 'gameStarted',
  moveMade = 'moveMade',
  receiveMessage = 'receiveMessage',
  receiveGiveUp = 'receiveGiveUp',
  queueUpdated = 'queueUpdated',
  runningGamesUpdated = 'runningGamesUpdated',
}

export interface ClientToServerEvents {
  enterQueue: () => void;
  leaveQueue: () => void;
  sendGiveUp: () => void;
  makeMove: (move: MoveDto) => void;
  gameFoundAcknowledged: () => void;
  sendMessage: (message: ChatDto) => void;
  enterSpectate: (data: SpectateDto) => void;
  leaveSpectate: (date: SpectateDto) => void;
}

export interface ServerToClientEvents {
  gameFound: () => void;
  receiveGiveUp: () => void;
  gameStarted: (opponent: UserDto) => void;
  moveMade: (update: GameUpdateDto) => void;
  receiveMessage: () => void;
  queueUpdated: () => void;
  runningGamesUpdated: () => void;
}
