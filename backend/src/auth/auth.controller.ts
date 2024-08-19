import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from '../guards/roles/roles.guard';
import { SessionData } from 'express-session';
import { UsersService } from '../users/users.service';
import { UserDto } from '../users/dto/user.dto';
import { DataSource, Repository } from 'typeorm';
import { Game } from '../games/games.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly gameRepository: Repository<Game>;

  constructor(
    private authService: AuthService,
    private dataSource: DataSource,
    private userService: UsersService,
  ) {
    this.gameRepository = this.dataSource.getRepository(Game);
  }

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

    const userInfo = await this.userService.getCurrentUserInformation(session);
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

  @Get('admin-only')
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: 'Check if the Authenticated User is an Admin',
    description: 'Gets the Info of the User with a Flag',
  })
  @ApiOkResponse({ description: 'Successful operation' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async adminOnlyRoute(@Session() session: SessionData) {
    if (session.user.isAdmin === true) {
      return {
        admin: session.isAdmin,
      };
    } else {
      return {
        message: 'This route is only accessible by the admin',
      };
    }
  }
}
