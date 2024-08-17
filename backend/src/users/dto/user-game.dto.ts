import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';
import { Timestamp } from 'typeorm';

export class UserGameDto {
  @ApiProperty({ description: 'The ID of the game', example: 1 })
  gameId: number;

  @ApiProperty({ description: 'The player 1 details', type: UserDto })
  player1: UserDto;

  @ApiProperty({ description: 'The player 2 details', type: UserDto })
  player2: UserDto;

  @ApiProperty({ description: 'The result of the game', example: 'p1' })
  result: 'p1' | 'p2' | 'draw';

  @ApiProperty({ description: 'The time the game was played' })
  gameTime: Timestamp;

  @ApiProperty({ description: 'The game board', type: [Number] })
  board: number[];

  static from(game: any): UserGameDto {
    const dto = new UserGameDto();
    dto.gameId = game.id;
    dto.player1 = UserDto.from(game.player1);
    dto.player2 = UserDto.from(game.player2);
    dto.result = game.winningState;
    dto.gameTime = game.gameTime;

    return dto;
  }
}
