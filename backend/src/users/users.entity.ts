import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ProfilePicture } from '../profilePicture/profilePicture.entity';
import { Game } from '../games/games.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: 'varchar', length: 30 })
  username: string;

  @Column({ type: 'varchar', length: 50 })
  password: string;

  @OneToOne(() => ProfilePicture, { nullable: true })
  @JoinColumn({ name: 'profilePictureId' })
  profilePicture: ProfilePicture;

  @Column({ type: 'integer', default: 1000 })
  elo: number;

  @Column({ type: 'boolean', default: false })
  isAdmin: boolean;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
