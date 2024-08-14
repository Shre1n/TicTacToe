import { User } from '../users/users.entity';

export class QueueObject {
  player: User;
  sessionId: string;
  entryTime: Date;
}
