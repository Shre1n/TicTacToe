import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Check,
} from 'typeorm';
import { User } from '../users/users.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'The unique identifier for the game',
    example: 1,
  })
  id: number;

  @ManyToOne(() => User)
  @ApiProperty({
    description: 'The user playing as player 1',
    type: () => User,
  })
  player1: User;

  @ManyToOne(() => User)
  @ApiProperty({
    description: 'The user playing as player 2',
    type: () => User,
  })
  player2: User;

  @Column({ type: 'integer', default: 0 })
  @ApiProperty({
    description: 'The state of the game board for player 1',
    example: 0,
  })
  player1Board: number;

  @Column({ type: 'integer', default: 0 })
  @ApiProperty({
    description: 'The state of the game board for player 2',
    example: 0,
  })
  player2Board: number;

  @Column({ type: 'integer', default: 0 })
  @ApiProperty({
    description: 'Tracks how much elo player1 gained through the game',
    example: 0,
  })
  player1EloGain: number;

  @ApiProperty({
    description: 'Tracks how much elo player2 gained through the game',
    example: 0,
  })
  @Column({ type: 'integer', default: 0 })
  player2EloGain: number;

  @Column({ type: 'integer', default: 0 })
  @ApiProperty({
    description: 'How long the game lasted in ms',
    example: '1:00:00',
  })
  duration: number;

  @Column({ type: 'integer', default: 1 })
  @ApiProperty({ description: 'The current turn of the game', example: 1 })
  turn: 1 | 2;

  @Column({ type: 'boolean', default: false })
  @ApiProperty({
    description: 'Whether the game is currently playing or not',
    example: false,
  })
  isFinished: boolean;

  @Column({
    type: 'varchar',
    default: 'draw',
  })
  @Check(`winningState IN ('p1', 'p2', 'draw')`)
  @ApiProperty({
    description: 'The winning state of the game',
    example: 'draw',
  })
  winningState: 'p1' | 'p2' | 'draw';

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({ description: 'The date and time when the game was created' })
  createdAt: Date;

  board(): number[] {
    const board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < 9; i++) {
      if ((this.player1Board & (1 << i)) !== 0) board[i] = 1;
      else if ((this.player2Board & (1 << i)) !== 0) board[i] = 2;
    }
    return board;
  }
}
