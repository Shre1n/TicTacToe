import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Game } from './games.entity';
import { DataSource, Repository } from 'typeorm';
import { User } from '../users/users.entity';
import { EloService } from '../elo/elo.service';
import { ChatService } from './chat/chat.service';
import { GameDto } from './dto/game.dto';

@Injectable()
export class GamesService {
  private readonly userRepository: Repository<User>;
  private readonly gameRepository: Repository<Game>;

  private winMasks = [
    0b111000000, // Row 1
    0b000111000, // Row 2
    0b000000111, // Row 3
    0b100100100, // Column 1
    0b010010010, // Column 2
    0b001001001, // Column 3
    0b100010001, // Diagonal 1
    0b001010100, // Diagonal 2
  ];

  constructor(
    private dataSource: DataSource,
    private readonly eloService: EloService,
    private readonly chatService: ChatService,
  ) {
    this.gameRepository = this.dataSource.getRepository(Game);
    this.userRepository = this.dataSource.getRepository(User);
  }

  /**
   * Creates a new Game and saves it to the DB. Starting Turn is set randomly.
   * The created game is returned.
   * @param player1
   * @param player2
   */
  async createGame(player1: User, player2: User) {
    if (!player1 || !player2) {
      throw new NotFoundException('One or both players not found');
    }

    const game = new Game();
    game.player1 = player1;
    game.player2 = player2;
    game.turn = Math.random() < 0.5 ? 1 : 2;
    return await this.gameRepository.save(game);
  }

  /**
   * Process game on a surrender. Adjusts winningState, isFinished, elo and duration.
   * @param game
   * @param playerId - player who has given up
   */
  async giveUp(game: Game, playerId: number): Promise<Game> {
    if (game.player1.id === playerId) {
      game.winningState = 'p2';
      game.isFinished = true;
    } else {
      game.winningState = 'p1';
      game.isFinished = true;
    }
    await this.handleGameOver(game);
    return await this.gameRepository.save(game);
  }

  /**
   * Adjusts elo and duration of a game, that is finished.
   * @param game - finished game
   */
  async handleGameOver(game: Game) {
    if (!game.isFinished) return;
    await this.updateElo(game);
    const gameCreatedAt =
      game.createdAt instanceof Date
        ? game.createdAt
        : new Date(game.createdAt);
    game.duration = Date.now() - gameCreatedAt.getTime();
  }

  /**
   * Handles the logic to make a move and checks if there is a winner
   * @param game
   * @param playerId - id of the player who made the move
   * @param position - position of the board, begins at 0
   */
  async makeAMove(
    game: Game,
    playerId: number,
    position: number,
  ): Promise<Game> {
    if (
      (game.turn === 1 && game.player1.id !== playerId) ||
      (game.turn === 2 && game.player2.id !== playerId)
    ) {
      throw new BadRequestException('Not your turn!');
    }

    const move = 1 << position;
    if (game.player1Board & move || game.player2Board & move) {
      throw new BadRequestException('Invalid move!');
    }

    if (game.turn === 1) {
      game.player1Board |= move;
      game.turn = 2;
    } else {
      game.player2Board |= move;
      game.turn = 1;
    }

    if (this.checkWinner(game)) {
      await this.handleGameOver(game);
    }

    return await this.gameRepository.save(game);
  }

  /**
   * Checks if a given user is currently playing a game
   * @param player
   */
  async isPlayerInGame(player: User) {
    return await this.gameRepository.exists({
      where: [
        { player1: { id: player.id }, isFinished: false },
        { player2: { id: player.id }, isFinished: false },
      ],
      relations: { player1: true, player2: true },
    });
  }

  /**
   * Gets the game, that is currently played by the user
   * @param player
   */
  async getActiveGame(player: User) {
    return await this.gameRepository.findOne({
      where: [
        { player1: { id: player.id }, isFinished: false },
        { player2: { id: player.id }, isFinished: false },
      ],
      relations: [
        'player1',
        'player2',
        'player1.profilePicture',
        'player2.profilePicture',
      ],
    });
  }

  /**
   * Converts a game entity to a dto and adds the playerIdentity of a given user,
   * as well as the chat log of the game
   * @param game
   * @param user
   */
  async gameToFullDto(game: Game, user: User) {
    const chat = await this.getGameChat(game);
    const playerIdentity: 0 | 1 | 2 = this.getPlayerIdentity(game, user);
    return { ...GameDto.from(game), playerIdentity, chat };
  }

  /**
   * Gets all game a given user has finished
   * @param player
   */
  async getFinishedGamesByPlayer(player: User) {
    return await this.gameRepository.find({
      where: [
        { player1: { id: player.id }, isFinished: true },
        { player2: { id: player.id }, isFinished: true },
      ],
      relations: [
        'player1',
        'player2',
        'player1.profilePicture',
        'player2.profilePicture',
      ],
    });
  }

  /**
   * Gets the player identity of a give user
   * 1 for player1; 2 for player2; 0 for spectator
   * @param game
   * @param user
   */
  getPlayerIdentity(game: Game, user: User) {
    const isPlayer1 = game.player1.id == user.id;
    const isPlayer2 = game.player2.id == user.id;
    return isPlayer1 ? 1 : isPlayer2 ? 2 : 0;
  }

  /**
   * Gets all currently played games
   */
  async getActiveGames(): Promise<GameDto[]> {
    const games = await this.gameRepository.find({
      where: { isFinished: false },
      relations: [
        'player1',
        'player2',
        'player1.profilePicture',
        'player2.profilePicture',
      ],
    });
    return games.map((game) => GameDto.from(game));
  }

  /**
   * Checks if a given user has won the game
   * @param game
   * @param user
   */
  isWinner(game: Game, user: User) {
    const userAsPlayer1IsWinning =
      game.player1.id === user.id && game.winningState === 'p1';
    const userAsPlayer2IsWinning =
      game.player2.id === user.id && game.winningState === 'p2';

    return userAsPlayer1IsWinning || userAsPlayer2IsWinning;
  }

  /**
   * Returns first user matching the given username
   * @param username
   */
  async findOne(username: string) {
    return await this.userRepository.findOne({
      where: { username: username ?? '' },
      relations: { profilePicture: true },
    });
  }

  private async getGameChat(game: Game) {
    return this.chatService.getMessagesByGame(game);
  }

  private checkWinner(game: Game) {
    for (const combo of this.winMasks) {
      if ((game.player1Board & combo) === combo) {
        game.winningState = 'p1';
        game.isFinished = true;
        return true;
      } else if ((game.player2Board & combo) === combo) {
        game.winningState = 'p2';
        game.isFinished = true;
        return true;
      }
    }

    if ((game.player1Board | game.player2Board) === 0b111111111) {
      game.winningState = 'draw';
      game.isFinished = true;
      return true;
    }
    return false;
  }

  private async updateElo(game: Game) {
    switch (game.winningState) {
      case 'p1':
        game.player1EloGain = this.eloService.calculate(
          game.player1,
          game.player2,
          1,
        );
        game.player2EloGain = this.eloService.calculate(
          game.player2,
          game.player1,
          0,
        );
        break;
      case 'p2':
        game.player1EloGain = this.eloService.calculate(
          game.player1,
          game.player2,
          0,
        );
        game.player2EloGain = this.eloService.calculate(
          game.player2,
          game.player1,
          1,
        );
        break;
      case 'draw':
        game.player1EloGain = this.eloService.calculate(
          game.player1,
          game.player2,
          0.5,
        );
        game.player2EloGain = this.eloService.calculate(
          game.player2,
          game.player1,
          0.5,
        );
        break;
    }
    game.player1.elo += game.player1EloGain;
    game.player2.elo += game.player2EloGain;

    await this.userRepository.save(game.player1);
    await this.userRepository.save(game.player2);
  }
}
