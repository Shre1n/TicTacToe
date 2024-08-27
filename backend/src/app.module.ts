import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/users.entity';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UsersModule } from './users/users.module';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { RolesGuard } from './guards/roles/roles.guard';
import { ProfilePicture } from './profilePicture/profilePicture.entity';
import { AuthModule } from './auth/auth.module';
import { GamesModule } from './games/games.module';
import { ProfilePictureService } from './profilePicture/profilePicture.service';
import { Game } from './games/games.entity';
import { QueueModule } from './queue/queue.module';
import { ChatService } from './games/chat/chat.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './tic_tac_toe.sqlite',
      entities: [User, ProfilePicture, Game],
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(
        process.cwd(),
        '..',
        'frontend',
        'dist',
        'frontend',
        'browser',
      ),
    }),
    UsersModule,
    AuthModule,
    GamesModule,
    QueueModule,
  ],
  controllers: [],
  providers: [RolesGuard, ProfilePictureService],
})
export class AppModule implements OnModuleInit {
  // Generate an Admin User if no Admin exists
  constructor(private dataSource: DataSource) {}
  async onModuleInit() {
    const userRepository = this.dataSource.getRepository(User);
    const adminUser = await userRepository.findOne({
      where: { username: 'admin' },
    });

    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('adminPass', 10);

      const admin = userRepository.create({
        username: 'admin',
        password: hashedPassword,
        isAdmin: true,
        elo: 80000,
        createdAt: new Date(),
      });
      await userRepository.save(admin);
      console.log('Admin created', admin);
    } else {
      console.log('Admin already exists!');
    }
  }
}
