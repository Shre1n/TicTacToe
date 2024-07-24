import {Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn, OneToMany} from 'typeorm';
import { ProfilePicture } from '../profilePicture/profilePicture.entity';
import { Game } from '../games/games.entity';
import {ApiProperty} from "@nestjs/swagger";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number;

    @Column({ unique: true, type: 'varchar', length: 30 })
    @ApiProperty()
    username: string;

    @Column({ type: 'varchar', length: 50 })
    @ApiProperty()
    password: string;

    @OneToOne(() => ProfilePicture, { nullable: true })
    @JoinColumn({ name: 'profilePicture' })
    profilePicture: ProfilePicture;

    @Column({ type: 'integer', default: 1000 })
    elo: number;

    @Column({ type: 'boolean', default: false })
    isAdmin: boolean;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @OneToMany(() => Game, game => game.spieler1)
    gamesAsPlayer1: Game[];

    @OneToMany(() => Game, game => game.spieler2)
    gamesAsPlayer2: Game[];

}