import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../users.entity";
import {Repository} from "typeorm";

@Injectable()
export class AdminService {

    constructor() {}

    // async isAdmin(username: string): Promise<boolean> {
    //     const user = await this.usersRepository.findOne({ where: { username } });
    //     return user?.isAdmin || false;
    // }


}
