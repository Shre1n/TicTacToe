import {Body, Controller, Post, Request} from '@nestjs/common';
import {AuthService} from "./auth.service";
import { RegisterUserDto } from './dto/register-user.dto';
import {LoginUserDto} from "./dto/login-user.dto";

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}


    @Post('login')
    async login(@Body() LoginUserDto: LoginUserDto) {
        return this.authService.login(LoginUserDto.username, LoginUserDto.password);
    }

    @Post('register')
    async register(@Body() registerDTO: RegisterUserDto) {
        return this.authService.register(registerDTO.username, registerDTO.password);
    }

}
