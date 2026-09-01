import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../enums/user-role.enum';
import { AuthMethod } from '../../auth/enums/auth-method.enum';
import { Account } from '../../auth/entities/account.entity';

@Entity({ name: 'users' })
export class User {
  @ApiProperty({ example: 'c2b07384-d113-49c6-a5e1-7d13f9f74351' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ example: 'user@example.com' })
  @Column({ type: 'varchar', unique: true })
  email!: string;

  @ApiProperty({ example: '$2b$10$K37db...' })
  @Column({ type: 'varchar' })
  password!: string;

  @ApiProperty({ example: 'John Doe' })
  @Column({ type: 'varchar', name: 'display_name' })
  displayName!: string;

  @ApiProperty({
    example: 'https://example.com',
    required: false,
    nullable: true,
  })
  @Column({ type: 'varchar', nullable: true })
  picture!: string | null;

  @ApiProperty({ enum: UserRole, example: UserRole.REGULAR })
  @Column({ type: 'enum', enum: UserRole, default: UserRole.REGULAR })
  role!: UserRole;

  @ApiProperty({ example: false })
  @Column({ type: 'boolean', name: 'is_verified', default: false })
  isVerified!: boolean;

  @ApiProperty({ example: false })
  @Column({ type: 'boolean', name: 'is_two_factor_enabled', default: false })
  isTwoFactorEnabled!: boolean;

  @ApiProperty({ enum: AuthMethod, example: AuthMethod.CREDENTIALS })
  @Column({ type: 'enum', enum: AuthMethod })
  method!: AuthMethod;

  @OneToMany(() => Account, (account) => account.user)
  accounts!: Account[];

  @ApiProperty({ example: '2026-09-01T15:00:00.000Z' })
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-09-01T15:05:00.000Z' })
  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt!: Date;
}
