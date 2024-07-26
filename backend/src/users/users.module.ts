import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./users.entity";
import { AdminService } from './admin/admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, AdminService],
  exports: [UsersService]
})
export class UsersModule {}
