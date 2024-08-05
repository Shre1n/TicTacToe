import { UserDto } from '../../users/dto/user.dto';
import { Game } from '../games.entity';
import { ApiProperty } from '@nestjs/swagger';

export class MatchDto {
  @ApiProperty({
    description: 'The opponent of the user',
    example: 'james_smith',
  })
  opponent: UserDto;

  @ApiProperty({
    description: 'The outcome of the game',
    enum: ['self', 'opponent', 'draw'],
    example: 'self',
  })
  outcome: GameResult;

  @ApiProperty({ description: 'The length of the game' })
  gameTime: Date;

  @ApiProperty({ description: 'The start time of the game' })
  createdAt: Date;

  static from(opponent: UserDto, game: Game): MatchDto {
    const { gameTime, createdAt, winningState } = game;
    let outcome = GameResult.Self;
    if (
      (winningState === 'p1' && game.player1.username === opponent.username) ||
      (winningState === 'p2' && game.player2.username === opponent.username)
    )
      outcome = GameResult.Opponent;
    else if (winningState === 'draw') outcome = GameResult.Draw;

    return { opponent, gameTime, createdAt, outcome };
  }
}

export enum GameResult {
  Self = 'self',
  Opponent = 'opponent',
  Draw = 'draw',
}
