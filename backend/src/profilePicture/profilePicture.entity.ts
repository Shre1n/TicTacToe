import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class ProfilePicture {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'The unique identifier for the profile picture',
    example: 1,
  })
  id: number;

  @Column({
    type: 'blob',
  })
  @ApiProperty({
    description: 'The content of the profile picture as binary data',
  })
  content: Buffer;
}
