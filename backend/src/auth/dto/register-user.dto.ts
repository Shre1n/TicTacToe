import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsStrongPassword,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({
    description: 'user name. Must be unique.',
    example: 'john_doe',
  })
  username: string;

  @IsStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  @ApiProperty({
    description:
      'user password. MinLength: 6. Has to have at least one lower, one upper, one number and one symbol.',
    example: 'Pw12345!',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'repeat new password', example: 'Pw12345!' })
  password_confirmation: string;
}
