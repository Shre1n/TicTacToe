import { UserDto } from '../../users/dto/user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Game } from '../games.entity';
import { ChatDto } from '../chat/dto/chat.dto';

export class GameDto {
  @ApiProperty({ description: 'The user playing as player 1' })
  player1: UserDto;
  @ApiProperty({ description: 'The user playing as player 2' })
  player2: UserDto;
  @ApiProperty({
    description: 'Current Board. 1 is player1, 2 is player2 and 0 is empty',
  })
  board: number[];
  @ApiProperty({ description: 'Whether the game is already over' })
  isFinished: boolean;
  @ApiProperty({
    description: 'Whether player1 or player2 won, or the game ended in a draw',
  })
  winner: 'p1' | 'p2' | 'draw';
  @ApiProperty({ description: `Which player's turn is it currently` })
  turn: 1 | 2;

  @ApiProperty({ description: 'Chat from game' })
  chat: ChatDto[];

  static from(game: Game): GameDto {
    const board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < 9; i++) {
      if ((game.player1Board & (1 << i)) !== 0) board[i] = 1;
      else if ((game.player2Board & (1 << i)) !== 0) board[i] = 2;
    }
    return {
      player1: UserDto.from(game.player1),
      player2: UserDto.from(game.player2),
      turn: game.turn,
      isFinished: game.isFinished,
      board: board,
      winner: game.winningState,
      chat: [],
    };
  }
}
