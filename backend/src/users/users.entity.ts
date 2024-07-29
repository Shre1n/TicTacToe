import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { ProfilePicture } from '../profilePicture/profilePicture.entity';
import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcryptjs';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ unique: true, type: 'varchar', length: 30 })
  @ApiProperty({ description: 'The username of the user', example: 'john_doe' })
  username: string;

  @Column({ type: 'varchar', length: 50 })
  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  password: string;

  @OneToOne(() => ProfilePicture, { nullable: true })
  @JoinColumn({ name: 'profilePictureId' })
  @ApiProperty({
    description: 'The profile picture of the user',
    type: () => ProfilePicture,
    nullable: true,
  })
  profilePicture: ProfilePicture;

  @Column({ type: 'integer', default: 1000 })
  @ApiProperty({ description: 'The Elo rating of the user', example: 1500 })
  elo: number;

  @Column({ type: 'boolean', default: false })
  @ApiProperty({
    description: 'Whether the user is an admin or not',
    example: false,
  })
  isAdmin: boolean;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({ description: 'The date and time when the user was created' })
  createdAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
}
