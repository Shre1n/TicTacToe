import { ProfilePicture } from '../../profilePicture/profilePicture.entity';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users.entity';

export class UserDto {
  @ApiProperty({ description: 'The username of the user', example: 'john_doe' })
  username: string;

  @ApiProperty({
    description: 'The profile picture of the user',
    type: () => ProfilePicture,
    nullable: true,
  })
  profilePicture: ProfilePicture;

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
    return { username, elo, profilePicture };
  }
}

export enum UserState {
  Ready = 'ready',
  Waiting = 'waiting',
  Playing = 'playing',
}
