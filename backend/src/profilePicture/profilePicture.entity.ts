import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import {ApiProperty} from "@nestjs/swagger";

@Entity()
export class ProfilePicture {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    @ApiProperty()
    title: string;

    @Column({ type: 'blob' })
    @ApiProperty()
    content: Buffer;
}
