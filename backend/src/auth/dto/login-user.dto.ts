import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The user name for login', example: 'john_doe' })
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The password for login', example: 'pw123456' })
  password: string;
}
