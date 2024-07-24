import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/users.entity';
import {ApiProperty} from "@nestjs/swagger";

@Entity()
export class Game {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number;

    @ManyToOne(() => User, user => user.gamesAsPlayer1)
    @ApiProperty()
    spieler1: User;

    @ManyToOne(() => User, user => user.gamesAsPlayer2)
    @ApiProperty()
    spieler2: User;

    @Column({ type: 'integer', default: 0 })
    @ApiProperty()
    spielFeldS1: number;

    @Column({ type: 'integer', default: 0 })
    @ApiProperty()
    spielFeldS2: number;

    @Column({ type: 'time', default: () => 'CURRENT_TIME' })
    @ApiProperty()
    gameTime: Date;

    @Column({ type: 'integer', default: 1 })
    @ApiProperty()
    turn: number;

    @Column({ type: 'boolean', default: true })
    @ApiProperty()
    isPlaying: boolean;

    @Column({
        type: 'enum',
        enum: ['p1', 'p2', 'draw'],
        default: 'draw'
    })
    @ApiProperty()
    winningState: 'p1' | 'p2' | 'draw';

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    @ApiProperty()
    createdAt: Date;
}
