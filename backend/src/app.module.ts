import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/users.entity';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UsersModule } from './users/users.module';
import { RolesGuard } from './guards/roles/roles.guard';
import { ProfilePicture } from './profilePicture/profilePicture.entity';
import { AuthModule } from './auth/auth.module';
import { GamesModule } from './games/games.module';
import { ProfilePictureService } from './profilePicture/profilePicture.service';
import { Game } from './games/games.entity';
import { QueueModule } from './queue/queue.module';
import { DemoDataService } from './demodata/demo-data.service';

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
  providers: [RolesGuard, ProfilePictureService, DemoDataService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly demoDataService: DemoDataService) {}
  async onModuleInit() {
    if (!(await this.demoDataService.dataExists()))
      await this.demoDataService.generateData();
  }
}
