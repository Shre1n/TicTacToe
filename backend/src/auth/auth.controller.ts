import {Body, Controller, Post, Request} from '@nestjs/common';
import {AuthService} from "./auth.service";
import { RegisterUserDto } from './dto/register-user.dto';
import {LoginUserDto} from "./dto/login-user.dto";
import {ApiResponse} from "@nestjs/swagger";
import {User} from "../users/users.entity";

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}


    @Post('login')
    @ApiResponse({status: 201, type: User})
    @ApiResponse({status: 403, description: 'Forbidden'})
    async login(@Body() LoginUserDto: LoginUserDto) {
        return this.authService.login(LoginUserDto.username, LoginUserDto.password);
    }

    @Post('register')
    @ApiResponse({status: 201, type: User})
    async register(@Body() registerDTO: RegisterUserDto) {
        return this.authService.register(registerDTO.username, registerDTO.password);
    }

}
