import { Body, Controller, Delete, Post, Session } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SessionData } from 'express-session';
import { UsersService } from '../users/users.service';
import { UserDto } from '../users/dto/user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Logs user into the system',
    description: 'Creates a user session and returns the authenticated user',
  })
  @ApiCreatedResponse({ description: 'Successful operation', type: UserDto })
  @ApiForbiddenResponse({ description: 'Forbidden' })
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
    session.isAdmin = user.isAdmin;

    const userInfo = await this.userService.getCurrentUserInformation(user);
    userInfo.isAdmin = user.isAdmin;
    return userInfo;
  }

  @Delete()
  @ApiOperation({
    summary: 'Logs user out of the system',
    description: 'Deletes a user session',
  })
  @ApiOkResponse({ description: 'Successful operation' })
  async logout(@Session() session: SessionData) {
    await this.authService.logout(session);
  }
}
