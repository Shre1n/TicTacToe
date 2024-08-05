import {
  Body,
  Controller,
  Delete,
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

    const game = await this.gameRepository.findOne({
      where: [
        { player1: user, isFinished: false },
        { player2: user, isFinished: false },
      ],
    });
    session.activeGameId = game ? game.id : -1;

    return this.userService.getCurrentUserInformation(session);
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

  @Post('admin-only')
  @UseGuards(RolesGuard)
  async adminOnlyRoute() {
    return { message: 'This route is only accessible by the admin' };
  }
}
