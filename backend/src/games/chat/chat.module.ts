import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller'; // Pfad zum ChatController
import { ChatService } from './chat.service'; // Pfad zum ChatService

@Module({
  imports: [],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
