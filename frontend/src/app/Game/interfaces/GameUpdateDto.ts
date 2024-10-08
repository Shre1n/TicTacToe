export interface GameUpdateDto {
  board: number[];
  position: number;
  turn: number;
  isFinished: boolean;
  winner: 'p1' | 'p2' | 'draw';
}
