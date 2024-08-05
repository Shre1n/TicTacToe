import {
  BadRequestException,
  ForbiddenException,
  Injectable,
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

@Injectable()
export class UsersService {
  private readonly usersRepository: Repository<User>;
  private readonly gameRepository: Repository<Game>;

  constructor(private dataSource: DataSource) {
    this.usersRepository = this.dataSource.getRepository(User);
    this.gameRepository = this.dataSource.getRepository(Game);
  }

  async create(registerDto: RegisterUserDto) {
    if (registerDto.password !== registerDto.password_confirmation)
      throw new BadRequestException('Passwords do not match');

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

  async getCurrentUserInformation(session: SessionData) {
    const dto = UserDto.from(session.user);
    dto.state = UserState.Ready;
    if (session.activeGameId != -1) {
      const activeGame = await this.gameRepository.findOneBy({
        id: session.activeGameId,
      });
      if (activeGame?.isFinished === false) {
        dto.state = UserState.Playing;
      }
    }
    // TODO: Matchmaking State
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

  async getUserProfile(user: User) {
    const games = await this.gameRepository.find({
      where: [
        // TODO: Check logic after merging with game branch + relations
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
      updatePasswordDto.old_password,
      user.password,
    );
    if (!verify) throw new ForbiddenException('Invalid credentials');

    if (
      updatePasswordDto.new_password !==
      updatePasswordDto.new_password_confirmation
    )
      throw new BadRequestException('Passwords do not match');

    const hashed_password = await bcrypt.hash(
      updatePasswordDto.new_password,
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
