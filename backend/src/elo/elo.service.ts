import { Injectable } from '@nestjs/common';
import { User } from '../users/users.entity';

@Injectable()
export class EloService {
  private readonly kFactor: number = 20;
  calculate(player: User, opponent: User, performance_rating: 1 | 0 | 0.5) {
    const e = 1 / (1 + Math.pow(10, (opponent.elo - player.elo) / 400));
    return this.kFactor * (performance_rating - e);
  }
}
