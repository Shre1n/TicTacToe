import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import {ApiProperty} from "@nestjs/swagger";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number;

    @Column({ unique: true })
    @ApiProperty()
    username: string;

    @Column()
    @ApiProperty()
    password: string;
}