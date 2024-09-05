import { Game } from '../games.entity';

export class GameUpdateDto {
  id: number;
  board: number[];
  position: number;
  turn: number;
  isFinished: boolean;
  winner: 'p1' | 'p2' | 'draw';

  static from(game: Game, position: number): GameUpdateDto {
    return {
      id: game.id,
      turn: game.turn,
      isFinished: game.isFinished,
      board: game.board(),
      winner: game.winningState,
      position,
    };
  }
}
