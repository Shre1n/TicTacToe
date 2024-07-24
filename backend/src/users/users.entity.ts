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
    @ApiProperty({ description: 'The username of the user', example: 'john_doe' })
    username: string;

    @Column({ type: 'varchar', length: 50 })
    @ApiProperty({ description: 'The password of the user', example: 'password123' })
    password: string;

    @OneToOne(() => ProfilePicture, { nullable: true })
    @JoinColumn({ name: 'profilePicture' })
    @ApiProperty({ description: 'The profile picture of the user', type: () => ProfilePicture, nullable: true })
    profilePicture: ProfilePicture;

    @Column({ type: 'integer', default: 1000 })
    @ApiProperty({ description: 'The Elo rating of the user', example: 1500 })
    elo: number;

    @Column({ type: 'boolean', default: false })
    @ApiProperty({ description: 'Whether the user is an admin or not', example: false })
    isAdmin: boolean;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    @ApiProperty({ description: 'The date and time when the user was created' })
    createdAt: Date;

    @OneToMany(() => Game, game => game.spieler1)
    @ApiProperty({ type: () => [Game], description: 'Games where the user is player 1' })
    gamesAsPlayer1: Game[];

    @OneToMany(() => Game, game => game.spieler2)
    @ApiProperty({ type: () => [Game], description: 'Games where the user is player 2' })
    gamesAsPlayer2: Game[];

}