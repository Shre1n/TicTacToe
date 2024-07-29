import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./users.entity";
import { AdminService } from './admin/admin.service';
import {ProfilePicture} from "../profilePicture/profilePicture.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, ProfilePicture])],
  providers: [UsersService, AdminService],
  exports: [UsersService]
})
export class UsersModule {}
