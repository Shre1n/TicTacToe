import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './users.entity';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Game } from '../games/games.entity';
import { UserStatsDto } from './dto/user-stats.dto';
import { ProfileDto } from './dto/profile.dto';
import { MatchDto } from '../games/dto/match.dto';
import { UserDto, UserState } from './dto/user.dto';

@Injectable()
export class UsersService {
  private readonly usersRepository: Repository<User>;
  private readonly gameRepository: Repository<Game>;

  constructor(private dataSource: DataSource) {
    this.usersRepository = this.dataSource.getRepository(User);
    this.gameRepository = this.dataSource.getRepository(Game);
  }

  async create(username: string, password: string) {
    const dbCheck = await this.usersRepository.findOne({ where: { username } });
    if (dbCheck) throw new BadRequestException('Username already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      username,
      password: hashedPassword,
    });
    await this.usersRepository.save(user);

    const dto = UserDto.from(user);
    dto.state = UserState.Ready;
    return dto;
  }

  async findOne(username: string) {
    return this.usersRepository.findOne({ where: { username } });
  }

  async getCurrentUserInformation(user: User) {
    const dto = UserDto.from(user);
    dto.state = UserState.Ready;
    // const activeGame = await this.gameRepository.findOne({
    //   where: [
    //     // TODO: Check logic after merging with game branch
    //     { spieler1: user, isPlaying: true },
    //     { spieler2: user, isPlaying: true },
    //   ],
    // });
    // if (activeGame) {
    //   dto.state = UserState.Playing;
    // }
    return dto;
  }

  async getUserStats(games: Game[], user: User) {
    const stats = new UserStatsDto();
    stats.wins = games.filter(
      (g) =>
        (g.spieler1 === user && g.winningState == 'p1') ||
        (g.spieler2 === user && g.winningState == 'p1'),
    ).length;

    stats.draws = games.filter((g) => g.winningState == 'draw').length;

    stats.loses = games.length - stats.wins - stats.draws;

    return stats;
  }

  async getMatchHistory(games: Game[], user: User) {
    return games.map((g) =>
      MatchDto.from(
        UserDto.from(g.spieler1 == user ? g.spieler2 : g.spieler1),
        g,
      ),
    );
  }

  async getUserProfile(user: User) {
    // const games = await this.gameRepository.findBy([
    //   // TODO: Check logic after merging with game branch
    //   { spieler1: user, isPlaying: false },
    //   { spieler2: user, isPlaying: false },
    // ]);
    //
    // const stats = await this.getUserStats(games, user);
    // const matches = await this.getMatchHistory(games, user);

    return ProfileDto.from(user, null, null /*stats, matches*/);
  }
}
