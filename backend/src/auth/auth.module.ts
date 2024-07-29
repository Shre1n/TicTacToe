import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {UsersModule} from "../users/users.module";
import {AdminService} from "../users/admin/admin.service";

@Module({
  imports: [UsersModule],
  providers: [AuthService, AdminService],
  controllers: [AuthController]
})
export class AuthModule {}
