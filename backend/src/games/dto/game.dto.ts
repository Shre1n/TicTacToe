import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GameDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  player1: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  player2: number;
}
