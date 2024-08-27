import {AfterViewChecked, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
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
export class ChatComponent implements OnInit, AfterViewChecked{

  @ViewChild('chatMessages') chatMessages!: ElementRef;

  @ViewChild('chatInput')
  private chatInput!: ElementRef<HTMLInputElement>;

  isChatOpen = false;

  message: string = '';

  @Input() messages: ChatDTO[] = [];

  constructor(
    protected connectService: ConnectService,
    protected tictactoeService: TictactoeService) {
  }

  ngOnInit() {
    this.connectService.receiveMessage = (message) => {
      this.messages.push(message);
      this.scrollToBottom();
    };

    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }



  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
    if (this.isChatOpen) {
      setTimeout(() => {
        this.chatInput.nativeElement.focus();
      }, 0);
      setTimeout(() => this.scrollToBottom(), 0);
    }
  }

  trackByMinimal(index: number): number {
    return index;
  }

  sendMessage() {
    if (this.message.trim()) {
      this.messages.push(this.connectService.sendMessage(this.message));
      this.scrollToBottom();
      this.message = '';
    }
  }

  scrollToBottom() {
    try {
      if (this.chatMessages)
        this.chatMessages.nativeElement.scrollTop = this.chatMessages.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }
}
