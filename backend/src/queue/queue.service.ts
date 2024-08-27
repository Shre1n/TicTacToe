import { Injectable } from '@nestjs/common';
import { User } from '../users/users.entity';
import { QueueObject } from './queueObject';
import { QueueDto } from './dto/queue.dto';
import { QueueEntryDto } from './dto/queueEntry.dto';
import { PreGameObject } from './preGameObject';
import { Semaphore } from './Semaphore';

@Injectable()
export class QueueService {
  private readonly maxEloDifference = 200;
  private readonly acknowledgementTimeout = 30000; //ms => 30s
  // Queue for player searching fo an opponent
  private queue: QueueObject[] = [];
  private semaphore = new Semaphore(1);

  // Queue for two matching player, waiting to confirm their match
  private acknowledgementQueue: PreGameObject[] = [];

  /**
   * Returns the queue content as DTO
   */
  getQueue() {
    const queue = new QueueDto();
    queue.queueEntries = this.queue.map((x) => QueueEntryDto.from(x));
    return queue;
  }

  /**
   * Checks if player is currently in queue
   * @param player - user that is checked
   */
  isPlayerInQueue(player: User) {
    this.semaphore.acquire();
    try {
      return (
        this.queue.some((x) => x.player.id === player.id) ||
        this.isWaitingForAcknowledgement(player)
      );
    } finally {
      this.semaphore.release();
    }
  }

  /**
   * Searches for another player in queue within elo range.
   * If multiple are found, the one with the longest waiting time is taken.
   * If no one is found, undefined will be returned, otherwise the chosen opponent
   * @param player - user looking for an opponent
   */
  async findOpponent(player: User): Promise<QueueObject | undefined> {
    await this.semaphore.acquire();
    try {
      const candidates = this.queue.filter(
        (x) => Math.abs(x.player.elo - player.elo) <= this.maxEloDifference,
      );

      // Only 1 matching candidate
      if (candidates.length == 1) {
        this.queue = this.queue.filter(
          (x) => x.player.id !== candidates[0].player.id,
        );
        return candidates[0];
      }

      // More than one matching candidate
      if (candidates.length > 1)
        return candidates.reduce((prev, curr) =>
          prev && prev.entryTime > curr.entryTime ? prev : curr,
        );

      return undefined;
    } finally {
      this.semaphore.release();
    }
  }

  /**
   * Adds a player with his session ID and the current time to the queue
   * @param player - user that is added to the queue
   * @param sessionId - session ID of the user
   */
  async addPlayer(player: User, sessionId: string) {
    await this.semaphore.acquire();
    try {
      this.queue.push({ player, entryTime: new Date(), sessionId });
    } finally {
      this.semaphore.release();
    }
  }

  /**
   * Removes a player from the queue
   * @param player - user that is removed
   */
  async removePlayer(player: User) {
    await this.semaphore.acquire();
    try {
      this.queue = this.queue.filter((x) => x.player.id !== player.id);
    } finally {
      this.semaphore.release();
    }
  }

  /**
   * Adds a preGame object to the acknowledgementQueue
   * Returns true for success and false for failure
   * @param preGame - a preGame object consisting of two players, their sessionID
   * and their acknowledgement state
   */
  prepareGame(preGame: PreGameObject) {
    this.semaphore.acquire();
    try {
      if (
        this.isWaitingForAcknowledgement(preGame.player1) ||
        this.isWaitingForAcknowledgement(preGame.player2)
      )
        return false;

      this.acknowledgementQueue.push(preGame);
      return true;
    } finally {
      this.semaphore.release();
    }
  }

  /**
   * Checks if a player is waiting for acknowledgement
   * If the user was added before a defined time span,
   * the related preGame is taken as not acknowledged
   * and will be removed from the acknowledgementQueue
   * @param player - user that is checked
   */
  isWaitingForAcknowledgement(player: User) {
    const preGame = this.acknowledgementQueue.filter(
      (x) => x.player1.id === player.id || x.player2.id === player.id,
    );
    if (
      preGame.length > 0 &&
      Date.now() - preGame[0].createdAt.getTime() > this.acknowledgementTimeout
    ) {
      this.removePreGame(player);
      return false;
    }
    return preGame.length > 0;
  }

  /**
   * Removes the preGame related to the player from the acknowledgementQueue
   * and returns it
   * @param player - User the preGame is related to
   */
  removePreGame(player: User) {
    this.semaphore.acquire();
    try {
      const preGame = this.acknowledgementQueue.filter(
        (x) => x.player1.id === player.id || x.player2.id === player.id,
      )[0];
      this.acknowledgementQueue = this.acknowledgementQueue.filter(
        (x) => x.player1.id !== player.id && x.player2.id !== player.id,
      );
      return preGame;
    } finally {
      this.semaphore.release();
    }
  }

  /**
   * Checks if a pregame is acknowledged from both players
   * @param player - User the preGame is related to
   */
  isPreGameAcknowledged(player: User) {
    this.semaphore.acquire();
    try {
      return this.acknowledgementQueue.some(
        (x) =>
          (x.player1.id === player.id || x.player2.id === player.id) &&
          x.player1Acknowledged &&
          x.player2Acknowledged,
      );
    } finally {
      this.semaphore.release();
    }
  }

  /**
   * Acknowledges a preGame
   * @param player - User who acknowledges the related preGame
   */
  acknowledgePreGame(player: User) {
    this.acknowledgementQueue = this.acknowledgementQueue.map((x) => {
      if (x.player1.id == player.id) return { player1Acknowledged: true, ...x };
      if (x.player2.id === player.id)
        return { player2Acknowledged: true, ...x };
      return x;
    });
  }
}
