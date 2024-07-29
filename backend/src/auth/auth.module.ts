import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {UsersModule} from "../users/users.module";
import {AdminService} from "../users/admin/admin.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../users/users.entity";
import {ProfilePicture} from "../profilePicture/profilePicture.entity";
import {UsersService} from "../users/users.service";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [AuthService, AdminService, UsersService],
  controllers: [AuthController]
})
export class AuthModule {}
