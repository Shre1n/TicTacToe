import { UserDto } from '../../users/dto/user.dto';
import { Game } from '../games.entity';
import { ApiProperty } from '@nestjs/swagger';

export class MatchDto {
  @ApiProperty({
    description: 'The the user',
    example: 'john_doe',
  })
  player: UserDto;

  @ApiProperty({
    description: 'The opponent of the user',
    example: 'james_smith',
  })
  opponent: UserDto;

  @ApiProperty({ description: 'The final Board Layout' })
  board: number[];

  @ApiProperty({ description: 'The players identity on the board' })
  playerIdentity: 1 | 2;

  @ApiProperty({
    description: 'The outcome of the game',
    enum: ['self', 'opponent', 'draw'],
    example: 'self',
  })
  outcome: GameResult;

  @ApiProperty({ description: 'The length of the game in ms' })
  duration: number;

  @ApiProperty({ description: 'The start time of the game' })
  createdAt: Date;

  @ApiProperty({
    description: 'Tracks how much elo the user gained through the game',
    example: 0,
  })
  eloGain: number;

  static from(player: UserDto, opponent: UserDto, game: Game): MatchDto {
    let outcome = GameResult.Self;
    if (
      (game.winningState === 'p1' && game.player1.username === opponent.username) ||
      (game.winningState === 'p2' && game.player2.username === opponent.username)
    )
      outcome = GameResult.Opponent;
    else if (game.winningState === 'draw') outcome = GameResult.Draw;

    return {
      board: game.board(),
      player,
      playerIdentity: game.player1.username === player.username ? 1 : 2,
      opponent,
      duration: game.duration,
      createdAt: game.createdAt,
      outcome,
      eloGain:
        game.player1.username === opponent.username
          ? game.player2EloGain
          : game.player1EloGain,
    };
  }
}

export enum GameResult {
  Self = 'self',
  Opponent = 'opponent',
  Draw = 'draw',
}
