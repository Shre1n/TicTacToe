import {
  Body,
  Controller,
  Get,
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
import { FileUploadDTO } from '../profilePicture/dto/fileUpload.dto';
import { ProfilePictureService } from '../profilePicture/profilePicture.service';

@ApiTags('user')
@Controller('user')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private profilePictureService: ProfilePictureService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Creates a new user',
    description:
      'Creates a new user, creates user session and returns the newly created user',
  })
  @ApiCreatedResponse({ description: 'Successful operation', type: UserDto })
  @ApiBadRequestResponse({
    description:
      'Username already exists, passwords do not match or input validation failed',
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
  @Get('me')
  @ApiOperation({
    summary: 'Gets the current user',
    description:
      'Gets some basic infos about the current user. The user has to be logged in',
  })
  @ApiOkResponse({ description: 'Successful operation', type: UserDto })
  async getUserInfo(@Session() session: SessionData): Promise<UserDto> {
    console.log(session.user);
    return this.usersService.getCurrentUserInformation(session.user);
  }

  @UseGuards(IsLoggedInGuard)
  @Get('profile')
  @ApiOperation({
    summary: 'Gets profile information of current user',
    description:
      'Gets all relevant profile infos about the current user. The user has to be logged in',
  })
  @ApiOkResponse({ description: 'Successful operation', type: ProfileDto })
  async getUserProfile(@Session() session: SessionData): Promise<UserDto> {
    return this.usersService.getUserProfile(session.user);
  }

  @UseGuards(IsLoggedInGuard)
  @Put()
  @ApiOperation({
    summary: 'Updates the password of the current user',
    description: 'The user has to be logged in',
  })
  @ApiOkResponse({ description: 'Successful operation' })
  @ApiBadRequestResponse({
    description: 'Invalid Input or Passwords do not match',
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async updatePassword(
    @Session() session: SessionData,
    @Body() passwordDto: UpdatePasswordDto,
  ) {
    await this.usersService.updatePassword(passwordDto, session.user);
    session.user = await this.usersService.findOne(session.user.username);
  }

  @Get('avatar/:id')
  @ApiOperation({
    summary: 'Gets avatar from id',
    description: 'Streams avatar with given id',
  })
  @ApiParam({ name: 'id', description: 'Avatar ID', example: '1' })
  @ApiOkResponse()
  @ApiNotFoundResponse()
  async getAvatar(@Param('id', ParseIntPipe) id: number) {
    const data = await this.profilePictureService.get(id);
    if (!data) throw new NotFoundException('Avatar not found');
    return new StreamableFile(data.content);
  }

  @UseGuards(IsLoggedInGuard)
  @Post('avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiOperation({
    summary: 'Sets the user avatar',
    description: 'Sets the user avatar. The user has to be logged in',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Avatar',
    type: FileUploadDTO,
  })
  @ApiCreatedResponse({ description: 'Successful operation', type: UserDto })
  @ApiUnprocessableEntityResponse({ description: 'Invalid File' })
  async setAvatar(
    @Session() session: SessionData,
    @Body() data: FileUploadDTO,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'jpg|jpeg|png|webp' })
        .addMaxSizeValidator({ maxSize: 1024 * 1000 })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    avatar: Express.Multer.File,
  ) {
    const newProfilePicture = await this.profilePictureService.save(
      data.title,
      avatar,
      session.user,
    );
    session.user = await this.usersService.updateAvatar(
      session.user,
      newProfilePicture,
    );
    return await this.usersService.getCurrentUserInformation(session.user);
  }
}
