import {
  Body,
  Controller,
  Get,
  Header,
  HttpStatus,
  NotFoundException,
  Param,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Post,
  Put,
  Session,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { RegisterUserDto } from '../auth/dto/register-user.dto';
import { UsersService } from './users.service';
import { UserDto, UserState } from './dto/user.dto';
import { SessionData } from 'express-session';
import { IsLoggedInGuard } from '../guards/is-logged-in/is-logged-in.guard';
import { ProfileDto } from './dto/profile.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadDto } from '../profilePicture/dto/fileUploadDto';
import { ProfilePictureService } from '../profilePicture/profilePicture.service';
import { RolesGuard } from '../guards/roles/roles.guard';
import { GameDto } from '../games/dto/game.dto';
import { User } from './users.entity';

@ApiTags('user')
@Controller('user')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private profilePictureService: ProfilePictureService,
  ) {}

  @UseGuards(RolesGuard)
  @Get()
  @ApiOperation({ summary: 'Gets all users' })
  @ApiOkResponse({ description: 'successful operation', type: [UserDto] })
  async getAllUsers() {
    const users = await this.usersService.getAllUsers();
    return users.map((x) => UserDto.from(x));
  }

  @Post()
  @ApiOperation({
    summary: 'Creates a new user',
    description:
      'Creates a new user, creates user session and returns the newly created user',
  })
  @ApiCreatedResponse({ description: 'Successful operation', type: UserDto })
  @ApiBadRequestResponse({
    description: 'Username already exists or input validation failed',
  })
  async register(
    @Session() session: SessionData,
    @Body() registerDTO: RegisterUserDto,
  ) {
    const user = await this.usersService.create(registerDTO);

    session.user = user;
    session.isLoggedIn = true;

    const dto = UserDto.from(user);
    dto.state = UserState.Ready;
    return dto;
  }

  @UseGuards(IsLoggedInGuard)
  @Get('@me')
  @ApiOperation({
    summary: 'Gets the current user',
    description:
      'Gets some basic infos about the current user. The user has to be logged in',
  })
  @ApiOkResponse({ description: 'Successful operation', type: UserDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getUserInfo(@Session() session: SessionData): Promise<UserDto> {
    const user: UserDto =
      await this.usersService.getCurrentUserInformation(session);
    user.isAdmin = session.user.isAdmin;
    return user;
  }

  @UseGuards(IsLoggedInGuard)
  @Get('@me/profile')
  @ApiOperation({
    summary: 'Gets profile information of current user',
    description:
      'Gets all relevant profile infos about the current user. The user has to be logged in',
  })
  @ApiOkResponse({ description: 'Successful operation', type: ProfileDto })
  async getUserProfile(@Session() session: SessionData): Promise<ProfileDto> {
    return this.usersService.getUserProfile(session.user);
  }

  @UseGuards(IsLoggedInGuard)
  @Put('@me')
  @ApiOperation({
    summary: 'Updates the password of the current user',
    description: 'The user has to be logged in',
  })
  @ApiOkResponse({ description: 'Successful operation' })
  @ApiBadRequestResponse({
    description: 'Invalid Input',
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async updatePassword(
    @Session() session: SessionData,
    @Body() passwordDto: UpdatePasswordDto,
  ) {
    await this.usersService.updatePassword(passwordDto, session.user);
    session.user = await this.usersService.findOne(session.user.username);
  }

  @UseGuards(IsLoggedInGuard)
  @Get('@me/game')
  @ApiOperation({
    summary: 'Gets the active game of the current user',
    description:
      'Gets the game, the user is currently playing in. 404 the user has no game, he is playing in. The user has to be logged in',
  })
  @ApiOkResponse({ description: 'Successful operation', type: GameDto })
  @ApiNotFoundResponse({ description: 'The user is not playing a game' })
  async getActiveUserGames(@Session() session: SessionData): Promise<GameDto> {
    return await this.usersService.getActiveUserGame(session.user);
  }

  @UseGuards(IsLoggedInGuard)
  @Get('@me/waitingTime')
  @ApiOperation({
    summary: 'Gets the time the user is waiting in the queue',
    description:
      'Gets the queue waiting time of the user. Returns 404 if user is not in queue',
  })
  @ApiOkResponse({ description: 'Successful operation', type: 'number' })
  @ApiNotFoundResponse({ description: 'The user is not waiting in the queue' })
  async getWaitingTime(@Session() session: SessionData): Promise<number> {
    const waitingTime = this.usersService.getWaitingTime(session.user);
    if (!waitingTime) throw new NotFoundException('Player not in queue');
    return waitingTime;
  }

  @UseGuards(IsLoggedInGuard)
  @Post('@me/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiOperation({
    summary: 'Sets the user avatar',
    description: 'Sets the user avatar. The user has to be logged in',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Avatar',
    type: FileUploadDto,
  })
  @ApiCreatedResponse({ description: 'Successful operation', type: UserDto })
  @ApiUnprocessableEntityResponse({ description: 'Invalid File' })
  async setAvatar(
    @Session() session: SessionData,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'jpg|jpeg|png|webp' })
        .addMaxSizeValidator({ maxSize: 1024 * 1000 })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    avatar: Express.Multer.File,
  ) {
    const newProfilePicture = await this.profilePictureService.save(
      avatar,
      session.user,
    );
    session.user = await this.usersService.updateAvatar(
      session.user,
      newProfilePicture,
    );
    return await this.usersService.getCurrentUserInformation(session);
  }

  @Get('avatar/:id')
  @ApiOperation({
    summary: 'Gets avatar from id',
    description: 'Streams avatar with given id',
  })
  @ApiParam({ name: 'id', description: 'Avatar ID', example: '1' })
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @Header('Content-Type', 'image/png')
  async getAvatar(@Param('id', ParseIntPipe) id: number) {
    const data = await this.profilePictureService.get(id);
    if (!data) throw new NotFoundException('Avatar not found');
    return new StreamableFile(data.content);
  }

  @UseGuards(RolesGuard)
  @Get(':username')
  @ApiOperation({
    summary: 'Gets profile information of user with given name',
    description: 'Gets all relevant profile infos about the user.',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiOkResponse({ description: 'Successful operation', type: ProfileDto })
  async getUserProfileByUsername(
    @Param('username') username: string,
  ): Promise<ProfileDto> {
    const user: User = await this.usersService.findOne(username);
    if (!user) throw new NotFoundException('User not found');
    return this.usersService.getUserProfile(user);
  }
}
