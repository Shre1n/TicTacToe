import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./users.entity";
import {Repository} from "typeorm";
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async create(username: string, password: string){
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.usersRepository.create({ username, password: hashedPassword});
        return this.usersRepository.save(user);
    }

    async findOne(username: string){
        return this.usersRepository.findOne({ where: { username } });
    }
}

