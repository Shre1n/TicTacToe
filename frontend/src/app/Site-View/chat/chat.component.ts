import {Component, ElementRef, ViewChild} from '@angular/core';
import {ChatDTO} from "./dto/chat.dto";
import {ConnectService} from "../../services/connect.service";
import {FormsModule} from "@angular/forms";
import {GameDto} from "../../Admin/admin-dashboard/interfaces/Game/gamesDto";
import {CurrentGamesComponent} from "../../Admin/admin-dashboard/current-games/current-games.component";
import {TictactoeService} from "../../tic-tac-toe/services/tictactoe.service";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {

  @ViewChild('chatMessages') chatMessages!: ElementRef;

  isChatOpen = false;

  message: string = '';

  gameId: number = 0;

  constructor(protected connectService: ConnectService, private tictactoeService: TictactoeService) {
    this.gameId = this.tictactoeService.gameId;
    this.loadMessages();

    this.connectService.receiveMessage = (message) => {
      this.connectService.messages.push(message);
      this.scrollToBottom();
    };
  }

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
    if (this.isChatOpen) {
      setTimeout(() => this.scrollToBottom(), 0);
    }
  }

  sendMessage() {
    if (this.message.trim()) {
      this.connectService.sendMessage(this.gameId, this.message);
      this.message = '';
    }
  }

  scrollToBottom() {
    try {
      this.chatMessages.nativeElement.scrollTop = this.chatMessages.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }

  private loadMessages(){
    this.connectService.getMessages(this.gameId)
  }

}
