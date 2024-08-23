import { User } from '../users/users.entity';

export class PreGameObject {
  player1: User;
  player1Id: string;
  player1Acknowledged: boolean;

  player2: User;
  player2Id: string;
  player2Acknowledged: boolean;

  createdAt: Date;

  constructor(
    player1: User,
    player2: User,
    player1Id: string,
    player2Id: string,
  ) {
    this.player1 = player1;
    this.player2 = player2;
    this.player1Id = player1Id;
    this.player2Id = player2Id;

    this.createdAt = new Date();
  }
}
