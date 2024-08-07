import { Injectable } from '@nestjs/common';
import { SessionData } from 'express-session';
import { DataSource, Repository } from 'typeorm';
import { User } from '../users/users.entity';
import { Game } from '../games/games.entity';
import { QueueObject } from './queueObject';
import { QueueDto } from './dto/queue.dto';
import { QueueEntryDto } from './dto/queueEntry.dto';

@Injectable()
export class QueueService {
  private readonly usersRepository: Repository<User>;
  private readonly gameRepository: Repository<Game>;
  private readonly maxEloDifference = 200;
  private queue: QueueObject[] = [];

  constructor(private dataSource: DataSource) {
    this.usersRepository = this.dataSource.getRepository(User);
    this.gameRepository = this.dataSource.getRepository(Game);
  }

  getQueue() {
    const queue = new QueueDto();
    queue.queueEntries = this.queue.map((x) => QueueEntryDto.from(x));
    return queue;
  }

  async isPlayerInGame(gameId: number) {
    if (gameId != -1) {
      const activeGame = await this.gameRepository.findOneBy({
        id: gameId,
      });
      if (activeGame?.isFinished === false) {
        return true;
      }
    }
    return false;
  }

  isPlayerInQueue(player: User) {
    return this.queue.some((x) => x.player.id === player.id);
  }

  /**
   * Searches for another player in queue within elo range.
   * If multiple are found, the one with the longest waiting time is taken.
   * If no one is found, the player is added to the queue.
   * The chosen opponent is removed from the queue.
   * @param player
   */
  async findOpponent(player: User): Promise<User | undefined> {
    const candidates = this.queue.filter(
      (x) => Math.abs(x.player.elo - player.elo) <= this.maxEloDifference,
    );

    if (candidates.length == 1) {
      this.queue = this.queue.filter(
        (x) => x.player.id !== candidates[0].player.id,
      );
      return candidates[0].player;
    }

    if (candidates.length > 1) {
      const opponent = candidates.reduce((prev, curr) =>
        prev && prev.entryTime > curr.entryTime ? prev : curr,
      ).player;
      this.removePlayer(opponent);
      return opponent;
    }

    this.queue.push({ player, entryTime: new Date() });
    return undefined;
  }

  removePlayer(player: User) {
    this.queue = this.queue.filter((x) => x.player.id !== player.id);
  }
}
