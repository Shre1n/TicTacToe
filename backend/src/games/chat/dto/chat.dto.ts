import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChatDto {
  @ApiProperty({ description: 'The game id for the current game.' })
  @IsNotEmpty()
  gameId: number;

  @ApiProperty({ description: 'The username of the sender.' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'The content of the chat message.' })
  @IsNotEmpty()
  message: string;
}
