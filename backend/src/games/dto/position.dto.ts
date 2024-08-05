import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PositionDto {
  @ApiProperty()
  @IsNumber()
  position: number;
}
