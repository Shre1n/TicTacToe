import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SpectateDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  username: string;
}
