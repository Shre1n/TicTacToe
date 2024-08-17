import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users.entity';

export class UserDto {
  @ApiProperty({ description: 'The username of the user', example: 'john_doe' })
  username: string;

  @ApiProperty({
    description: 'The profile picture id of the user',
    nullable: true,
  })
  profilePictureId: number;

  @ApiProperty({ description: 'The Elo rating of the user', example: 1500 })
  elo: number;

  @ApiProperty({
    description: 'The current state of the user',
    enum: ['ready', 'waiting', 'playing'],
    example: 'ready',
    nullable: true,
  })
  state?: UserState;

  public static from(user: User): UserDto {
    const { username, elo, profilePicture } = user;
    return {
      username,
      elo: Math.round(elo),
      profilePictureId: profilePicture?.id,
    };
  }
}

export enum UserState {
  Ready = 'ready',
  Waiting = 'waiting',
  Playing = 'playing',
}
