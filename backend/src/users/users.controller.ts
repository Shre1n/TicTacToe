import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './users.entity';
import { RegisterUserDto } from '../auth/dto/register-user.dto';
import { UsersService } from './users.service';

@ApiTags('user')
@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('register')
  @ApiResponse({ status: 201, type: User })
  async register(@Body() registerDTO: RegisterUserDto) {
    return this.usersService
      .create(registerDTO.username, registerDTO.password)
      .catch(() => {
        throw new BadRequestException('Username already exists');
      });
  }
}
