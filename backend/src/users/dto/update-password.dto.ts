import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Old password. Used to verify your access' })
  old_password: string;

  @IsStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  @ApiProperty({
    description:
      'New Password. MinLength: 6. Has to have at least one lower, one upper, one number and one symbol.',
    example: 'Pw12345!',
  })
  new_password: string;
}
