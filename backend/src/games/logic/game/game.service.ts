import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Game } from '../../games.entity';
import { DataSource, Repository } from 'typeorm';
import { User } from '../../../users/users.entity';

@Injectable()
export class GameService {
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

  constructor(private dataSource: DataSource) {
    this.gameRepository = this.dataSource.getRepository(Game);
    this.userRepository = this.dataSource.getRepository(User);
  }

  async createGame(player1Id: number, player2Id: number) {
    const player1 = await this.userRepository.findOne({
      where: { id: player1Id },
    });
    const player2 = await this.userRepository.findOne({
      where: { id: player2Id },
    });

    if (!player1 || !player2) {
      throw new NotFoundException('One or both players not found');
    }

    const game = new Game();
    game.player1 = player1;
    game.player2 = player2;
    game.turn = Math.random() < 0.5 ? 1 : 2;
    return this.gameRepository.save(game);
  }

  async makeAMove(gameId: number, playerId: number, position: number) {
    const game = await this.gameRepository.findOne({
      where: { id: gameId },
      relations: ['player1', 'player2'],
    });

    if (!game) throw new NotFoundException('Game not found');

    if (game.isFinished) throw new BadRequestException('Game already finished');

    if (
      (game.turn === 1 && game.player1.id !== playerId) ||
      (game.turn === 2 && game.player2.id !== playerId)
    ) {
      throw new BadRequestException('Not your turn');
    }

    const move = 1 << position;
    if (game.player1Board & move || game.player2Board & move) {
      throw new BadRequestException('Position already taken');
    }

    if (game.turn === 1) {
      game.player1Board |= move;
      game.turn = 2;
    } else {
      game.player2Board |= move;
      game.turn = 1;
    }

    this.checkWinner(game);
    return this.gameRepository.save(game);
  }

  private checkWinner(game: Game) {
    for (const combo of this.winMasks) {
      if ((game.player1Board & combo) === combo) {
        game.winningState = 'p1';
        game.id = -1;
        game.isFinished = true;
        return;
      } else if ((game.player2Board & combo) === combo) {
        game.winningState = 'p2';
        game.id = -1;
        game.isFinished = true;
        return;
      }
    }

    if ((game.player1Board | game.player2Board) === 0b111111111) {
      game.winningState = 'draw';
      game.id = -1;
      game.isFinished = true;
    }
  }

  async getGameStatus(gameId: number) {
    const game = await this.gameRepository.findOne({
      where: { id: gameId },
      relations: ['player1', 'player2'],
    });

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    return game;
  }
}
