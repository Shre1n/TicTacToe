import {
  Body,
  Controller,
  Delete,
  Post,
  Req,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '../users/users.entity';
import { RolesGuard } from '../guards/roles/roles.guard';
import { SessionData } from 'express-session';
import { Request } from 'express';
import { DataSource, Repository } from 'typeorm';
import { Game } from '../games/games.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly gameRepository: Repository<Game>;
  constructor(
    private authService: AuthService,
    private dataSource: DataSource,
  ) {
    this.gameRepository = this.dataSource.getRepository(Game);
  }

  @Post()
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

  @Delete()
  logout(@Req() request: Request) {
    return this.authService.logout(request);
  }

  @Post('admin-only')
  @UseGuards(RolesGuard)
  async adminOnlyRoute() {
    return { message: 'This route is only accessible by the admin' };
  }
}
