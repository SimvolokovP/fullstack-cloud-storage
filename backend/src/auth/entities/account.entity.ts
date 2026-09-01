import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'accounts' })
export class Account {
  @ApiProperty({ example: 'e4f26829-1065-4a61-9c6a-4933a3cbdfb8' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ example: 'oauth' })
  @Column({ type: 'varchar' })
  type!: string;

  @ApiProperty({ example: 'google' })
  @Column({ type: 'varchar' })
  provider!: string;

  @ApiProperty({ example: 'v1.01a...', required: false, nullable: true })
  @Column({ type: 'varchar', name: 'refresh_token', nullable: true })
  refreshToken!: string | null;

  @ApiProperty({ example: 'ya29.a0...', required: false, nullable: true })
  @Column({ type: 'varchar', name: 'access_token', nullable: true })
  accessToken!: string | null;

  @ApiProperty({ example: 3600 })
  @Column({ type: 'integer', name: 'expires_at' })
  expiresAt!: number;

  @ApiProperty({ example: '2026-09-01T15:00:00.000Z' })
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-09-01T15:05:00.000Z' })
  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt!: Date;

  @ApiProperty({
    example: 'c2b07384-d113-49c6-a5e1-7d13f9f74351',
    required: false,
    nullable: true,
  })
  @Column({ type: 'varchar', name: 'user_id', nullable: true })
  userId!: string | null;

  @ManyToOne(() => User, (user) => user.accounts, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user!: User | null;
}
