import {Body, Controller, Post, Request} from '@nestjs/common';
import {AuthService} from "./auth.service";
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}


    @Post('login')
    async login(@Body() loginUserDTO: LoginUserDto, @Request() req) {
        const user = await this.authService.validateUser(req.username, req.password);
        if (user) {
            return this.authService.login(req.user);
        } else {
            return { message: 'Invalid credentials' };
        }
    }

    @Post('register')
    async register(@Body() registerDTO: RegisterUserDto) {
        return this.authService.register(registerDTO.username, registerDTO.password);
    }

}
