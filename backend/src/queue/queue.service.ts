import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../users/users.entity';
import { Game } from '../games/games.entity';
import { QueueObject } from './queueObject';
import { QueueDto } from './dto/queue.dto';
import { QueueEntryDto } from './dto/queueEntry.dto';
import { PreGameObject } from './preGameObject';

@Injectable()
export class QueueService {
  private readonly usersRepository: Repository<User>;
  private readonly gameRepository: Repository<Game>;
  private readonly maxEloDifference = 200;
  private queue: QueueObject[] = [];
  private acknowledgementQueue: PreGameObject[] = [];

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
    return (
      this.queue.some((x) => x.player.id === player.id) ||
      this.isWaitingForAcknowledgement(player)
    );
  }

  /**
   * Searches for another player in queue within elo range.
   * If multiple are found, the one with the longest waiting time is taken.
   * If no one is found, the player is added to the queue.
   * The chosen opponent is removed from the queue.
   * @param player
   */
  async findOpponent(player: User): Promise<QueueObject | undefined> {
    const candidates = this.queue.filter(
      (x) => Math.abs(x.player.elo - player.elo) <= this.maxEloDifference,
    );

    if (candidates.length == 1) {
      this.queue = this.queue.filter(
        (x) => x.player.id !== candidates[0].player.id,
      );
      return candidates[0];
    }

    if (candidates.length > 1)
      return candidates.reduce((prev, curr) =>
        prev && prev.entryTime > curr.entryTime ? prev : curr,
      );

    return undefined;
  }

  addPlayer(player: User, sessionId: string) {
    this.queue.push({ player, entryTime: new Date(), sessionId });
  }

  removePlayer(player: User) {
    this.queue = this.queue.filter((x) => x.player.id !== player.id);
  }

  prepareGame(preGame: PreGameObject) {
    if (
      this.isWaitingForAcknowledgement(preGame.player1) ||
      this.isWaitingForAcknowledgement(preGame.player2)
    )
      return false;

    this.acknowledgementQueue.push(preGame);
    return true;
  }

  isWaitingForAcknowledgement(player: User) {
    const preGame = this.acknowledgementQueue.filter(
      (x) => x.player1.id === player.id || x.player2.id === player.id,
    );
    if (
      preGame.length > 0 &&
      Date.now() - preGame[0].createdAt.getTime() > 30000
    ) {
      this.removePreGame(player);
      return false;
    }
    return preGame.length > 0;
  }

  removePreGame(player: User) {
    const preGame = this.acknowledgementQueue.filter(
      (x) => x.player1.id === player.id || x.player2.id === player.id,
    )[0];
    this.acknowledgementQueue = this.acknowledgementQueue.filter(
      (x) => x.player1.id !== player.id && x.player2.id !== player.id,
    );
    return preGame;
  }

  isPreGameAcknowledged(player: User) {
    return this.acknowledgementQueue.some(
      (x) =>
        (x.player1.id === player.id || x.player2.id === player.id) &&
        x.player1Acknowledged &&
        x.player2Acknowledged,
    );
  }

  acknowledgePreGame(player: User) {
    this.acknowledgementQueue = this.acknowledgementQueue.map((x) =>
      x.player1.id == player.id
        ? { player1Acknowledged: true, ...x }
        : x.player2.id === player.id
          ? { player2Acknowledged: true, ...x }
          : x,
    );
  }
}
