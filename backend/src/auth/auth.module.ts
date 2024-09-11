import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import { EloService } from '../elo/elo.service';
import { UsersModule } from '../users/users.module';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), UsersModule, QueueModule],
  providers: [AuthService, EloService],
  controllers: [AuthController],
})
export class AuthModule {}
