import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class MoveDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(8)
  position: number;
}
