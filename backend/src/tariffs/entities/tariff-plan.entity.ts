import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'tariff_plans' })
export class TariffPlan {
  @ApiProperty({ example: 'b1a7384-d113-49c6-a5e1-7d13f9f74352' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ example: 'Premium' })
  @Column({ type: 'varchar', unique: true })
  name!: string;

  @ApiProperty({
    example: '100 ГБ пространства для ваших файлов',
    required: false,
    nullable: true,
  })
  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @ApiProperty({ example: 107374182400 })
  @Column({ type: 'bigint', name: 'max_space' })
  maxSpace!: number;

  @ApiProperty({ example: 5368709120 })
  @Column({ type: 'bigint', name: 'max_file_size' })
  maxFileSize!: number;

  @ApiProperty({ example: 299.0 })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  price!: number;

  @ApiProperty({ example: true })
  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive!: boolean;

  @OneToMany(() => User, (user) => user.tariffPlan)
  users!: User[];

  @ApiProperty({ example: '2026-09-01T15:00:00.000Z' })
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-09-01T15:05:00.000Z' })
  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt!: Date;
}
