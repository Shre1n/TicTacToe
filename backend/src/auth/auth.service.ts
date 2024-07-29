import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

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

  async register(username: string, password: string) {
    return this.usersService.create(username, password).catch(() => {
      throw new BadRequestException('Username already exists');
    });
  }
}
