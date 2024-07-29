import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {User} from "./users/users.entity";
import * as session from "express-session";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); //Enable CORS Requests
  app.useGlobalPipes(new ValidationPipe());

  app.use(
      session({
        secret: 'secret',
        resave: false,
        saveUninitialized: false,
      }),
  );

  const config = new DocumentBuilder()
      .setTitle('TicTacToe API')
      .setDescription('The TicTacToe API description')
      .setVersion('1.0')
      .addTag('tictactoe')
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();

declare module 'express-session' {
  interface SessionData {
    isLoggedIn: boolean;
    user: User;
  }
}
