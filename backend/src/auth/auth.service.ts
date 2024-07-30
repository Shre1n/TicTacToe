import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  Req,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async login(username: string, password: string) {
    const user = await this.usersService.findOne(username);
    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        throw new ForbiddenException('Invalid credentials');
      }
      if (isMatch) {
        console.log('User authenticated');
      }
    });

    return user;
  }

  async logout(@Req() request: Request) {
    request.session.destroy(() => {
      return {
        message: 'Logout successful',
        statusCode: HttpStatus.OK,
      };
    });
  }
}
