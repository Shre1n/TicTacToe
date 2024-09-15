import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../users/users.entity';
import * as bcrypt from 'bcryptjs';
import { ProfilePicture } from '../profilePicture/profilePicture.entity';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Game } from '../games/games.entity';

@Injectable()
export class DemoDataService {
  private readonly userRepository: Repository<User>;
  private readonly profilePictureRepository: Repository<ProfilePicture>;
  private readonly gameRepository: Repository<Game>;

  private readonly basePath = join(
    process.cwd(),
    'assets',
    'demo-profile-pictures',
  );
  constructor(dataSource: DataSource) {
    this.userRepository = dataSource.getRepository(User);
    this.gameRepository = dataSource.getRepository(Game);
    this.profilePictureRepository = dataSource.getRepository(ProfilePicture);
  }

  /**
   * Generates demo data
   */
  async generateData() {
    const ava1 = this.profilePictureRepository.create({
      content: readFileSync(join(this.basePath, 'Conan.png')),
    });
    const ava2 = this.profilePictureRepository.create({
      content: readFileSync(join(this.basePath, '278324689892278272.png')),
    });
    const ava3 = this.profilePictureRepository.create({
      content: readFileSync(join(this.basePath, '236548570684194816.png')),
    });

    await this.profilePictureRepository.save([ava1, ava2, ava3]);

    const admin = this.userRepository.create({
      username: 'admin',
      isAdmin: true,
      password: await bcrypt.hash('adminPass', 10),
      profilePicture: ava1,
    });

    const user1 = this.userRepository.create({
      username: 'john_johnson',
      password: await bcrypt.hash('john_johnson', 10),
      profilePicture: ava2,
    });
    const user2 = this.userRepository.create({
      username: 'john_john',
      password: await bcrypt.hash('john_john', 10),
      profilePicture: ava3,
    });
    const user3 = this.userRepository.create({
      username: 'john_smith',
      password: await bcrypt.hash('john_smith', 10),
    });

    await this.userRepository.save([admin, user1, user2, user3]);

    const game1 = this.gameRepository.create({
      player1: user1,
      player2: user2,
      player1Board: (1 << 0) | (1 << 1) | (1 << 2),
      player2Board: (1 << 3) | (1 << 7) | (1 << 5),
      winningState: 'p1',
      isFinished: true,
      createdAt: new Date(1725190725609),
      duration: 300000,
      turn: 2,
      player1EloGain: 13,
      player2EloGain: -13,
    });

    const game2 = this.gameRepository.create({
      player1: user1,
      player2: user3,
      player1Board: (1 << 0) | (1 << 4) | (1 << 8),
      player2Board: (1 << 3) | (1 << 1) | (1 << 5),
      winningState: 'p1',
      isFinished: true,
      createdAt: new Date(1725190728609),
      duration: 150000,
      turn: 2,
      player1EloGain: 13,
      player2EloGain: -13,
    });

    const game3 = this.gameRepository.create({
      player1: user1,
      player2: user2,
      player1Board: (1 << 0) | (1 << 2) | (1 << 3) | (1 << 8) | (1 << 7),
      player2Board: (1 << 1) | (1 << 4) | (1 << 5) | (1 << 6),
      winningState: 'draw',
      isFinished: true,
      createdAt: new Date(1725190735609),
      duration: 350000,
      turn: 2,
      player1EloGain: 6,
      player2EloGain: 6,
    });

    const game4 = this.gameRepository.create({
      player1: user3,
      player2: user2,
      player1Board: (1 << 4) | (1 << 8) | (1 << 2) | (1 << 6),
      player2Board: (1 << 0) | (1 << 1) | (1 << 5),
      winningState: 'p1',
      isFinished: true,
      createdAt: new Date(1725190625609),
      duration: 200000,
      turn: 2,
      player1EloGain: 13,
      player2EloGain: -13,
    });

    const game5 = this.gameRepository.create({
      player1: user2,
      player2: user1,
      player1Board: (1 << 0) | (1 << 1) | (1 << 5),
      player2Board: (1 << 4) | (1 << 8) | (1 << 2) | (1 << 6),
      winningState: 'p2',
      isFinished: true,
      createdAt: new Date(1725190425609),
      duration: 300000,
      turn: 1,
      player1EloGain: -16,
      player2EloGain: 16,
    });

    await this.gameRepository.save([game1, game2, game3, game4, game5]);
  }

  /**
   * Checks if db with admin user exists
   */
  async dataExists() {
    return await this.userRepository.existsBy({ username: 'admin' });
  }
}
