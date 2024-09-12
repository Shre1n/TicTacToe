import { Injectable } from '@nestjs/common';
import { User } from '../users/users.entity';
import { QueueObject } from './queueObject';
import { QueueDto } from './dto/queue.dto';
import { QueueEntryDto } from './dto/queueEntry.dto';
import { PreGameObject } from './preGameObject';

@Injectable()
export class QueueService {
  private readonly maxEloDifference = 200;
  private readonly acknowledgementTimeout = 30000; //ms => 30s
  // Queue for player searching fo an opponent
  private queue: QueueObject[] = [];

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
   * Returns the Time a given user is waiting for a match
   * @param user
   */
  getWaitingTime(user: User) {
    return this.queue
      .filter((q) => q.player.id === user.id)
      .map((q) => Date.now() - q.entryTime.getTime())
      .pop();
  }

  /**
   * Checks if player is currently in queue
   * @param player - user that is checked
   */
  isPlayerInQueue(player: User) {
    return (
      this.queue.some((x) => x.player.id === player.id) ||
      this.isWaitingForAcknowledgement(player)
    );
  }

  /**
   * Searches for another player in queue within elo range.
   * If multiple are found, the one with the longest waiting time is taken.
   * If no one is found, undefined will be returned, otherwise the chosen opponent
   * @param player - user looking for an opponent
   */
  async findOpponent(player: User): Promise<QueueObject | undefined> {
    const candidates = this.queue.filter(
      (x) => Math.abs(x.player.elo - player.elo) <= this.maxEloDifference,
    );

    // Only 1 matching candidate
    if (candidates.length == 1) {
      return candidates[0];
    }

    // More than one matching candidate
    if (candidates.length > 1)
      return candidates.reduce((prev, curr) =>
        prev && prev.entryTime > curr.entryTime ? prev : curr,
      );

    return undefined;
  }

  /**
   * Adds a player with his session ID and the current time to the queue
   * @param player - user that is added to the queue
   * @param sessionId - session ID of the user
   */
  addPlayer(player: User, sessionId: string) {
    this.queue.push({ player, entryTime: new Date(), sessionId });
  }

  /**
   * Removes a player from the queue
   * @param player - user that is removed
   */
  removePlayer(player: User) {
    this.queue = this.queue.filter((x) => x.player.id !== player.id);
  }

  /**
   * Adds a preGame object to the acknowledgementQueue
   * Returns true for success and false for failure
   * @param preGame - a preGame object consisting of two players, their sessionID
   * and their acknowledgement state
   */
  prepareGame(preGame: PreGameObject) {
    if (
      this.isWaitingForAcknowledgement(preGame.player1) ||
      this.isWaitingForAcknowledgement(preGame.player2)
    )
      return false;

    this.acknowledgementQueue.push(preGame);
    return true;
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
    const preGame = this.acknowledgementQueue.filter(
      (x) => x.player1.id === player.id || x.player2.id === player.id,
    )[0];
    this.acknowledgementQueue = this.acknowledgementQueue.filter(
      (x) => x.player1.id !== player.id && x.player2.id !== player.id,
    );
    return preGame;
  }

  /**
   * Checks if a pregame is acknowledged from both players
   * @param player - User the preGame is related to
   */
  isPreGameAcknowledged(player: User) {
    return this.acknowledgementQueue.some(
      (x) =>
        (x.player1.id === player.id || x.player2.id === player.id) &&
        x.player1Acknowledged &&
        x.player2Acknowledged,
    );
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
