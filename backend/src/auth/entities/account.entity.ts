import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'accounts' })
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  type!: string;

  @Column({ type: 'varchar' })
  provider!: string;

  @Column({ type: 'varchar', name: 'refresh_token', nullable: true })
  refreshToken!: string | null;

  @Column({ type: 'varchar', name: 'access_token', nullable: true })
  accessToken!: string | null;

  @Column({ type: 'integer', name: 'expires_at' })
  expiresAt!: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt!: Date;

  @Column({ type: 'varchar', name: 'user_id', nullable: true })
  userId!: string | null;

  @ManyToOne(() => User, (user) => user.accounts, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user!: User | null;
}
