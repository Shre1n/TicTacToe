import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
    UnauthorizedException
} from '@nestjs/common';
import {UsersService} from "../users/users.service";
import * as bcrypt from 'bcryptjs';


@Injectable()
export class AuthService {

    constructor(private usersService: UsersService) {
    }

    async login(username: string, password: string){
        const user = await this.usersService.findOne(username);
        const validation = await bcrypt.compare(password, user.password);

        if (!user) {
            throw new ForbiddenException('Invalid credentials');
        }

        if (!validation) { // Hier solltest du ein sicheres Passwort-Hashing verwenden
            throw new ForbiddenException('Invalid credentials');
        }

        return user;
    }


    async register(username: string, password: string) {
        return this.usersService.create(username, password);
    }

}
