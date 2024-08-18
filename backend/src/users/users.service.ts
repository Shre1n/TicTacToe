import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { User } from './users.entity';
import { DataSource, Like, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Game } from '../games/games.entity';
import { UserStatsDto } from './dto/user-stats.dto';
import { ProfileDto } from './dto/profile.dto';
import { MatchDto } from '../games/dto/match.dto';
import { UserDto, UserState } from './dto/user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { RegisterUserDto } from '../auth/dto/register-user.dto';
import { ProfilePicture } from '../profilePicture/profilePicture.entity';
import { SessionData } from 'express-session';
import { GamesService } from '../games/games.service';
import { QueueService } from '../queue/queue.service';
import { UserGameDto } from './dto/user-game.dto';
import { GameDto } from '../games/dto/game.dto';

@Injectable()
export class UsersService {
  private readonly usersRepository: Repository<User>;
  private readonly gameRepository: Repository<Game>;

  constructor(
    private dataSource: DataSource,
    private gameService: GamesService,
    private queueService: QueueService,
  ) {
    this.usersRepository = this.dataSource.getRepository(User);
    this.gameRepository = this.dataSource.getRepository(Game);
  }

  async searchUsers(query: string) {
    const users = await this.usersRepository.find({
      where: {
        username: Like(`%${query}%`),
      },
      take: 10,
    });

    if (users.length === 0) {
      return [];
    }

    // Nur den ersten gefundenen Benutzer nehmen
    const user = users[0];

    // Spiele des Benutzers abrufen
    const games = await this.getUserGames(user);

    // Rückgabe des Benutzernamens und der Spiele
    return {
      username: user.username,
      games,
    };
  }

  async create(registerDto: RegisterUserDto) {
    const dbCheck = await this.usersRepository.findOne({
      where: { username: registerDto.username },
    });
    if (dbCheck) throw new BadRequestException('Username already exists');

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = this.usersRepository.create({
      username: registerDto.username,
      password: hashedPassword,
    });
    await this.usersRepository.save(user);
    return user;
  }

  async findOne(username: string) {
    return await this.usersRepository.findOne({
      where: { username },
      relations: { profilePicture: true },
    });
  }

  async isAdmin(session: SessionData): Promise<boolean> {
    return session.user.isAdmin;
  }

  async getCurrentUserInformation(session: SessionData) {
    const dto = UserDto.from(session.user);
    dto.state = UserState.Ready;
    if (this.queueService.isPlayerInQueue(session.user))
      dto.state = UserState.Waiting;

    if (await this.gameService.isPlayerInGame(session.user))
      dto.state = UserState.Playing;
    return dto;
  }

  async getUserStats(games: Game[], user: User) {
    const stats = new UserStatsDto();
    stats.wins = games.filter(
      (g) =>
        (g.player1 === user && g.winningState == 'p1') ||
        (g.player2 === user && g.winningState == 'p2'),
    ).length;

    stats.draws = games.filter((g) => g.winningState == 'draw').length;

    stats.loses = games.length - stats.wins - stats.draws;

    return stats;
  }

  async getMatchHistory(games: Game[], user: User) {
    return games.map((g) =>
      MatchDto.from(UserDto.from(g.player1 == user ? g.player2 : g.player1), g),
    );
  }

  //Admin
  async getUserGames(user: User) {
    const games = await this.gameRepository.find({
      where: [
        { player1: { id: user.id }, isFinished: true },
        { player2: { id: user.id }, isFinished: true },
      ],
      relations: ['player1', 'player2'],
    });
    return games.map((game) => GameDto.from(game));
  }

  async getUserProfile(user: User) {
    const games = await this.gameRepository.find({
      where: [
        { player1: user, isFinished: true },
        { player2: user, isFinished: true },
      ],
      relations: { player1: true, player2: true },
    });

    const stats = await this.getUserStats(games, user);
    const matches = await this.getMatchHistory(games, user);

    return ProfileDto.from(user, stats, matches);
  }

  async updatePassword(updatePasswordDto: UpdatePasswordDto, user: User) {
    const verify = await bcrypt.compare(
      updatePasswordDto.oldPassword,
      user.password,
    );
    if (!verify) throw new ForbiddenException('Invalid credentials');

    const hashed_password = await bcrypt.hash(
      updatePasswordDto.newPassword,
      10,
    );
    await this.usersRepository.update(
      { username: user.username },
      { password: hashed_password },
    );
  }

  async updateAvatar(user: User, profilePicture: ProfilePicture) {
    user.profilePicture = profilePicture;
    await this.usersRepository.save(user);
    return user;
  }
}
