import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/users.entity';
import {ApiProperty} from "@nestjs/swagger";

@Entity()
export class Game {
    @PrimaryGeneratedColumn()
    @ApiProperty({ description: 'The unique identifier for the game', example: 1 })
    id: number;

    @ManyToOne(() => User)
    @ApiProperty({ description: 'The user playing as player 1', type: () => User })
    spieler1: User;

    @ManyToOne(() => User)
    @ApiProperty({ description: 'The user playing as player 2', type: () => User })
    spieler2: User;

    @Column({ type: 'integer', default: 0 })
    @ApiProperty({ description: 'The state of the game board for player 1', example: 0 })
    spielFeldS1: number;

    @Column({ type: 'integer', default: 0 })
    @ApiProperty({ description: 'The state of the game board for player 2', example: 0 })
    spielFeldS2: number;

    @Column({ type: 'time', default: () => 'CURRENT_TIME' })
    @ApiProperty({
        description: 'The time when the game was created',
        example: '15:30:00'
    })
    gameTime: Date;

    @Column({ type: 'integer', default: 1 })
    @ApiProperty({ description: 'The current turn of the game', example: 1 })
    turn: number;

    @Column({ type: 'boolean', default: false })
    @ApiProperty({ description: 'Whether the game is currently playing or not', example: false })
    isPlaying: boolean;

    @Column({
        type: 'enum',
        enum: ['p1', 'p2', 'draw'],
        default: 'draw'
    })
    @ApiProperty({
        description: 'The winning state of the game',
        enum: ['p1', 'p2', 'draw'],
        example: 'draw'
    })
    winningState: 'p1' | 'p2' | 'draw';

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    @ApiProperty({ description: 'The date and time when the game was created' })
    createdAt: Date;
}
