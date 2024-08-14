import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './users.entity';
import { RegisterUserDto } from '../auth/dto/register-user.dto';
import { UsersService } from './users.service';

@ApiTags('user')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @ApiResponse({ status: 201, type: User })
  async register(@Body() registerDTO: RegisterUserDto) {
    return this.usersService
      .create(registerDTO.username, registerDTO.password)
      .catch(() => {
        throw new BadRequestException('Username already exists');
      });
  }

  @Get(':username')
  @ApiResponse({ status: 200, type: User })
  @ApiResponse({ status: 404, description: 'User does not exist' })
  async getUserByUsername(@Param('username') username: string) {
    const user = await this.usersService.findOne(username);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }
}
