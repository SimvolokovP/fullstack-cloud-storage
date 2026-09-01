import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { TokenType } from '../enums/token-type.enum';

@Entity({ name: 'tokens' })
export class Token {
  @ApiProperty({ example: 'd3b07384-d113-49c6-a5e1-7d13f9f74352' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ example: 'user@example.com' })
  @Column({ type: 'varchar' })
  email!: string;

  @ApiProperty({ example: 'a1b2c3d4e5f6' })
  @Column({ type: 'varchar', unique: true })
  token!: string;

  @ApiProperty({ enum: TokenType, example: TokenType.VERIFICATION })
  @Column({ type: 'enum', enum: TokenType })
  type!: TokenType;

  @ApiProperty({ example: '2026-09-01T15:30:00.000Z' })
  @Column({ type: 'timestamp', name: 'expires_in' })
  expiresIn!: Date;

  @ApiProperty({ example: '2026-09-01T15:00:00.000Z' })
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt!: Date;
}
