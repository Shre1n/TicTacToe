import {BadRequestException, Injectable} from '@nestjs/common';
import {UsersService} from "../users/users.service";
import * as bcrypt from 'bcryptjs';


@Injectable()
export class AuthService {

    constructor(private usersService: UsersService) {
    }

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.usersService.findOne(username);
        const passwordCheck = await bcrypt.compare(password, user.password);
        if (!user) {
            throw new BadRequestException("Username and password is required");
        }
        else if (passwordCheck){

        }
        return user;

    }

    async login(user: any) {
        return {
            username: user.username,
        };
    }

    async register(username: string, password: string) {
        return this.usersService.create(username, password);
    }

}
