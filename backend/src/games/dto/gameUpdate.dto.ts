import { Game } from '../games.entity';

export class GameUpdateDto {
  id: number;
  board: number[];
  position: number;
  turn: number;
  isFinished: boolean;
  winner: 'p1' | 'p2' | 'draw';

  static from(game: Game, position: number): GameUpdateDto {
    const board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < 9; i++) {
      if ((game.player1Board & (1 << i)) !== 0) board[i] = 1;
      else if ((game.player2Board & (1 << i)) !== 0) board[i] = 2;
    }
    return {
      id: game.id,
      turn: game.turn,
      isFinished: game.isFinished,
      board: board,
      winner: game.winningState,
      position,
    };
  }
}
