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

  /**
   * Returns all users in the db
   */
  async getAllUsers() {
    return await this.usersRepository.find();
  }

  /**
   * Creates a new user
   * @param registerDto - username and password; username must be unique
   */
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

  /**
   * Returns a user with a given username
   * @param username
   */
  async findOne(username: string) {
    return await this.usersRepository.findOne({
      where: { username: username ?? '' },
      relations: { profilePicture: true },
    });
  }

  /**
   * Gets the current queue waiting time of a given user
   * @param user
   */
  getWaitingTime(user: User) {
    return this.queueService.getWaitingTime(user);
  }

  /**
   * Transforms user entity into dto and sets the current state.
   * @param user
   */
  async getCurrentUserInformation(user: User) {
    const dto = UserDto.from(user);
    dto.state = UserState.Ready;
    if (this.queueService.isPlayerInQueue(user)) dto.state = UserState.Waiting;

    if (await this.gameService.isPlayerInGame(user))
      dto.state = UserState.Playing;
    return dto;
  }

  /**
   * Gets userstats across all played games
   * @param games
   * @param user
   */
  async getUserStats(games: Game[], user: User) {
    const stats = new UserStatsDto();
    stats.wins = games.filter((game) =>
      this.gameService.isWinner(game, user),
    ).length;

    stats.draws = games.filter((game) => game.winningState === 'draw').length;

    stats.loses = games.length - stats.wins - stats.draws;

    return stats;
  }

  /**
   * Gets the users match history
   * @param games
   * @param user
   */
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

  /**
   * Returns the currently played game of the user
   * @param user
   */
  async getActiveUserGame(user: User): Promise<GameDto> {
    const game = await this.gameService.getActiveGame(user);
    if (!game) throw new NotFoundException('Player not in a game');

    return await this.gameService.gameToFullDto(game, user);
  }

  /**
   * Returns stats and match history of a given user
   * @param user
   */
  async getUserProfile(user: User) {
    const games = await this.gameService.getFinishedGamesByPlayer(user);

    const stats = await this.getUserStats(games, user);
    const matches = await this.getMatchHistory(games, user);

    return ProfileDto.from(stats, matches);
  }

  /**
   * Changes the password of a user
   * @param updatePasswordDto
   * @param user
   */
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

  /**
   * Changes the password of the given user
   * @param user
   * @param profilePicture
   */
  async updateAvatar(user: User, profilePicture: ProfilePicture) {
    user.profilePicture = profilePicture;
    await this.usersRepository.save(user);
    return user;
  }
}
