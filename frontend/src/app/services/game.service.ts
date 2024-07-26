import {Injectable} from '@angular/core';
import {Players} from "../enums/players.enum";
import {GameStatus} from "../enums/gameStates.Enum";

@Injectable({
  providedIn: 'root'
})
export class GameService {


  private _boards: [number,number];
  private currentPlayer: Players;
  private movesCount: number;

  constructor() {
    this._boards = [0, 0];
    this.currentPlayer = Players.Player1;
    this.movesCount = 0;
  }

  getCurrentPlayer() {
    return this.currentPlayer;
  }

  play(position: number): GameStatus  {
    const mask = 1 << position;

    if ((this._boards[0] & mask) || (this._boards[1] & mask)) {
      throw new Error("Position already taken!");
    }

    this._boards[this.currentPlayer] |= mask;
    this.movesCount++;

    if (this.checkWin(this.currentPlayer)) {
      return this.currentPlayer === Players.Player1 ? GameStatus.Won : GameStatus.Lost;
    } else if (this.movesCount >= 9) { // Wenn alle 9 Zellen belegt sind und kein Gewinner da ist
      return GameStatus.Draw;
    }

    this.currentPlayer = this.currentPlayer === Players.Player1 ? Players.Player2 : Players.Player1;
    return GameStatus.Ongoing;
  }

  checkWin(player: Players): boolean {
    const winMasks = [
      0b111000000, // Row 1
      0b000111000, // Row 2
      0b000000111, // Row 3
      0b100100100, // Column 1
      0b010010010, // Column 2
      0b001001001, // Column 3
      0b100010001, // Diagonal 1
      0b001010100  // Diagonal 2
    ];

    for (const winMask of winMasks) {
      if ((this._boards[player] & winMask) === winMask) {
        return true;
      }
    }
    return false;

  }

  get boards(): [number, number] {
    return this._boards;
  }

  set boards(value: [number, number]) {
    this._boards = value;
  }
}
