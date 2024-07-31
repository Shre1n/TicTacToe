import {
  Body,
  Controller,
  Get,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RegisterUserDto } from '../auth/dto/register-user.dto';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { SessionData } from 'express-session';
import { IsLoggedInGuard } from '../guards/is-logged-in/is-logged-in.guard';
import { ProfileDto } from './dto/profile.dto';

@ApiTags('user')
@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'Creates a new user',
    description: 'Creates a new user and returns the newly created user',
  })
  @ApiCreatedResponse({ description: 'Successful operation', type: UserDto })
  @ApiBadRequestResponse({
    description: 'Username already exists or input validation failed',
  })
  async register(@Body() registerDTO: RegisterUserDto) {
    return await this.usersService.create(
      registerDTO.username,
      registerDTO.password,
    );
  }

  @UseGuards(IsLoggedInGuard)
  @Get('me')
  @ApiOperation({
    summary: 'Gets the current user',
    description:
      'Gets some basic infos about the current user. The user has to be logged in',
  })
  @ApiOkResponse({ description: 'Successful operation', type: UserDto })
  async getUserInfo(@Session() session: SessionData): Promise<UserDto> {
    return this.usersService.getCurrentUserInformation(session.user);
  }

  @UseGuards(IsLoggedInGuard)
  @Get('profile')
  @ApiOperation({
    summary: 'Gets profile information of current user',
    description:
      'Gets all relevant profile infos about the current user. The user has to be logged in',
  })
  @ApiOkResponse({ description: 'Successful operation', type: ProfileDto })
  async getUserProfile(@Session() session: SessionData): Promise<UserDto> {
    return this.usersService.getUserProfile(session.user);
  }
}
