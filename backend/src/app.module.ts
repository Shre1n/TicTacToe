import {Module, OnModuleInit} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./users/users.entity";
import { join } from 'path';
import {ServeStaticModule} from "@nestjs/serve-static";
import {AuthModule} from "./auth/auth.module";
import {UsersModule} from "./users/users.module";
import {Repository} from "typeorm";
import * as bcrypt from 'bcryptjs';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: './tic_tac_toe.sqlite',
            entities: [User],
            synchronize: true,
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'frontend/src'),
        }),
        UsersModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements OnModuleInit{
    // Generate an Admin User if no Admin exists
    private dataSource: Repository<User>;
    async onModuleInit() {
        const adminUser = await this.dataSource.findOne({ where: { username: 'admin' } })

        if (!adminUser) {
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(adminUser.password, salt);

            const admin = this.dataSource.create({
                username: 'admin',
                password: hashedPassword,
                isAdmin: true,
                elo: Number.POSITIVE_INFINITY,
                createdAt: new Date(),
            });
            await this.dataSource.save(admin);
            console.log("Admin created", admin);
        } else {
            console.log("Admin already exists!")
        }
    }


}
