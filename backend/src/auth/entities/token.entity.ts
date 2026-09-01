import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { TokenType } from '../enums/token-type.enum';

@Entity({ name: 'tokens' })
export class Token {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  email!: string;

  @Column({ type: 'varchar', unique: true })
  token!: string;

  @Column({ type: 'enum', enum: TokenType })
  type!: TokenType;

  @Column({ type: 'timestamp', name: 'expires_in' })
  expiresIn!: Date;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt!: Date;
}
