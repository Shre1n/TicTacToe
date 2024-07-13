import { IsString, IsNotEmpty } from 'class-validator';

export class RegisterUserDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}