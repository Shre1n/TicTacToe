export enum ClientSentEvents {
  enterQueue = 'enterQueue',
  leaveQueue = 'leaveQueue',
  makeMove = 'makeMove',
  getGameState = 'getGameState',
  gameFoundAcknowledged = 'gameFoundAcknowledged',
}

export enum ServerSentEvents {
  gameFound = 'gameFound',
  gameStarted = 'gameStarted',
  moveMade = 'moveMade',
  gameOver = 'gameOver',
  gameStateSent = 'gameStateSent',
}
