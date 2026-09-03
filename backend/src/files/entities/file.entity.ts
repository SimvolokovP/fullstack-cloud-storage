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

@Entity({ name: 'files' })
export class FileEntity {
  @ApiProperty({ example: 'e3b07384-d113-49c6-a5e1-7d13f9f74359' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ example: 'documents' })
  @Column({ type: 'varchar' })
  name!: string;

  @ApiProperty({
    example: 'users/86e378de/documents/report.pdf',
    nullable: true,
  })
  @Column({ type: 'varchar', name: 's3_key', unique: true, nullable: true })
  s3Key!: string | null;

  @ApiProperty({ example: 2048576 })
  @Column({ type: 'bigint', default: 0 })
  size!: number;

  @ApiProperty({ example: 'application/pdf', nullable: true })
  @Column({ type: 'varchar', name: 'mime_type', nullable: true })
  mimeType!: string | null;

  @ApiProperty({ example: false })
  @Column({ type: 'boolean', name: 'is_folder', default: false })
  isFolder!: boolean;

  @ApiProperty({
    example: 'c2b07384-d113-49c6-a5e1-7d13f9f74351',
    required: false,
    nullable: true,
  })
  @Column({ type: 'uuid', name: 'parent_id', nullable: true })
  parentId!: string | null;

  @ApiProperty({ example: false })
  @Column({ type: 'boolean', name: 'is_in_trash', default: false })
  isInTrash!: boolean;

  @ManyToOne(() => User, (user) => user.files, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_id' })
  owner!: User;

  @ApiProperty({ example: '2026-09-01T15:00:00.000Z' })
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-09-01T15:05:00.000Z' })
  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt!: Date;

  @ApiProperty({ example: '2026-09-02T10:00:00.000Z', nullable: true })
  @Column({ type: 'timestamp', name: 'deleted_at', nullable: true })
  deletedAt!: Date | null;
}
