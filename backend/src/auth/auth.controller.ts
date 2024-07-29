import { Body, Controller, Post, Session, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiResponse } from '@nestjs/swagger';
import { User } from '../users/users.entity';
import { RolesGuard } from '../guards/roles/roles.guard';
import { SessionData } from 'express-session';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiResponse({ status: 201, type: User })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async login(
    @Session() session: SessionData,
    @Body() LoginUserDto: LoginUserDto,
  ) {
    const user = await this.authService.login(
      LoginUserDto.username,
      LoginUserDto.password,
    );
    session.user = user;
    session.isLoggedIn = true;

    return user;
  }

  @Post('register')
  @ApiResponse({ status: 201, type: User })
  async register(@Body() registerDTO: RegisterUserDto) {
    return this.authService.register(
      registerDTO.username,
      registerDTO.password,
    );
  }

  @Post('admin-only')
  @UseGuards(RolesGuard)
  async adminOnlyRoute() {
    return { message: 'This route is only accessible by the admin' };
  }
}
