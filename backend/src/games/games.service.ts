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

  async createGame(player1Id: number, player2Id: number) {
    const player1 = await this.userRepository.findOne({
      where: { id: player1Id },
      relations: { profilePicture: true },
    });
    const player2 = await this.userRepository.findOne({
      where: { id: player2Id },
      relations: { profilePicture: true },
    });

    if (!player1 || !player2) {
      throw new NotFoundException('One or both players not found');
    }

    const game = new Game();
    game.player1 = player1;
    game.player2 = player2;
    game.turn = Math.random() < 0.5 ? 1 : 2;
    return await this.gameRepository.save(game);
  }

  async giveUp(game: Game, playerId: number): Promise<Game> {
    if (game.player1.id === playerId) {
      game.winningState = 'p2';
      game.isFinished = true;
    } else {
      game.winningState = 'p1';
      game.isFinished = true;
    }
    game = await this.updateElo(game);
    game.duration = Date.now() - game.createdAt.getTime();
    return await this.gameRepository.save(game);
  }

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
      game = await this.updateElo(game);
      game.duration = Date.now() - game.createdAt.getTime();
    }

    return await this.gameRepository.save(game);
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

  async isPlayerInGame(player: User) {
    return await this.gameRepository.exists({
      where: [
        { player1: { id: player.id }, isFinished: false },
        { player2: { id: player.id }, isFinished: false },
      ],
      relations: { player1: true, player2: true },
    });
  }

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

  async gameToFullDto(game: Game, user: User) {
    const chat = await this.getGameChat(game);
    const playerIdentity: 0 | 1 | 2 = this.getPlayerIdentity(game, user);
    return { ...GameDto.from(game), playerIdentity, chat };
  }

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

  async getGameChat(game: Game) {
    return this.chatService.getMessagesByGame(game);
  }

  getPlayerIdentity(game: Game, user: User) {
    const isPlayer1 = game.player1.id == user.id;
    const isPlayer2 = game.player2.id == user.id;
    return isPlayer1 ? 1 : isPlayer2 ? 2 : 0;
  }

  async getActiveGames(): Promise<Game[]> {
    return await this.gameRepository.find({
      where: { isFinished: false },
      relations: ['player1', 'player2'],
      select: {
        id: true,
        player1Board: false,
        player2Board: false,
        duration: true,
        turn: false,
        isFinished: false,
        createdAt: false,
        player1: {
          id: false,
          username: true,
        },
        player2: {
          id: false,
          username: true,
        },
        winningState: false,
      },
    });
  }

  isWinner(game: Game, user: User) {
    const userAsPlayer1IsWinning =
      game.player1.id === user.id && game.winningState === 'p1';
    const userAsPlayer2IsWinning =
      game.player2.id === user.id && game.winningState === 'p2';

    return userAsPlayer1IsWinning || userAsPlayer2IsWinning;
  }

  async updateElo(game: Game): Promise<Game> {
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
    return game;
  }
}
