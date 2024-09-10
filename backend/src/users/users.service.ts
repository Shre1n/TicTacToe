import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './users.entity';
import { DataSource, Repository } from 'typeorm';
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
import { GameDto } from '../games/dto/game.dto';

@Injectable()
export class UsersService {
  private readonly usersRepository: Repository<User>;

  constructor(
    private dataSource: DataSource,
    private gameService: GamesService,
    private queueService: QueueService,
  ) {
    this.usersRepository = this.dataSource.getRepository(User);
  }

  async getAllUsers() {
    return await this.usersRepository.find();
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
      where: { username: username ?? '' },
      relations: { profilePicture: true },
    });
  }

  getWaitingTime(user: User) {
    return this.queueService.getWaitingTime(user);
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
    stats.wins = games.filter((game) =>
      this.gameService.isWinner(game, user),
    ).length;

    stats.draws = games.filter((game) => game.winningState === 'draw').length;

    stats.loses = games.length - stats.wins - stats.draws;

    return stats;
  }

  async getMatchHistory(games: Game[], user: User) {
    return games.map((game) =>
      MatchDto.from(
        UserDto.from(user),
        UserDto.from(
          game.player1.username === user.username ? game.player2 : game.player1,
        ),
        game,
      ),
    );
  }

  async getActiveUserGame(user: User): Promise<GameDto> {
    const game = await this.gameService.getActiveGame(user);
    if (!game) throw new NotFoundException('Player not in a game');

    return await this.gameService.gameToFullDto(game, user);
  }

  async getUserProfile(user: User) {
    const games = await this.gameService.getFinishedGamesByPlayer(user);

    const stats = await this.getUserStats(games, user);
    const matches = await this.getMatchHistory(games, user);

    return ProfileDto.from(stats, matches);
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
