import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../enums/user-role.enum';
import { AuthMethod } from '../../auth/enums/auth-method.enum';
import { Account } from '../../auth/entities/account.entity';
import { FileEntity } from '../../files/entities/file.entity';
import { TariffPlan } from '../../tariffs/entities/tariff-plan.entity';

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

  @ApiProperty({ example: 5368709120 })
  @Column({ type: 'bigint', name: 'allocated_space', default: 5368709120 })
  allocatedSpace!: number;

  @ApiProperty({ example: 1048576 })
  @Column({ type: 'bigint', name: 'used_space', default: 0 })
  usedSpace!: number;

  @ManyToOne(() => TariffPlan, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'tariff_plan_id' })
  tariffPlan!: TariffPlan | null;

  @OneToMany(() => Account, (account) => account.user)
  accounts!: Account[];

  @OneToMany(() => FileEntity, (file) => file.owner)
  files!: FileEntity[];

  @ApiProperty({ example: '2026-09-01T15:00:00.000Z' })
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-09-01T15:05:00.000Z' })
  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt!: Date;
}
