// src/files/files.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { FileEntity } from './entities/file.entity';
import { User } from '../user/entities/user.entity';
import { CreateFolderDto } from './dto/create-folder.dto';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    // private readonly s3Service: S3Service,
  ) {}

  async createFolder(user: User, dto: CreateFolderDto): Promise<FileEntity> {
    if (dto.parentId) {
      await this.validateParentFolder(dto.parentId, user.id);
    }

    const folder = this.fileRepository.create({
      name: dto.name,
      isFolder: true,
      parentId: dto.parentId || null,
      owner: user,
    });

    return this.fileRepository.save(folder);
  }

  async getFiles(userId: string, parentId?: string): Promise<FileEntity[]> {
    return this.fileRepository.find({
      where: {
        owner: { id: userId },
        parentId: parentId ? parentId : IsNull(),
        isInTrash: false,
      },
      order: { isFolder: 'DESC', createdAt: 'DESC' },
    });
  }

  async getTrash(userId: string): Promise<FileEntity[]> {
    return this.fileRepository.find({
      where: { owner: { id: userId }, isInTrash: true },
      order: { deletedAt: 'DESC' },
    });
  }

  async moveToTrash(id: string, userId: string): Promise<{ success: boolean }> {
    const file = await this.fileRepository.findOne({
      where: { id, owner: { id: userId } },
    });
    if (!file) throw new NotFoundException('Объект не найден');

    await this.toggleTrashStateRecursive(file, true);
    return { success: true };
  }

  async restoreFromTrash(
    id: string,
    userId: string,
  ): Promise<{ success: boolean }> {
    const file = await this.fileRepository.findOne({
      where: { id, owner: { id: userId } },
    });
    if (!file) throw new NotFoundException('Объект не найден');

    await this.toggleTrashStateRecursive(file, false);
    return { success: true };
  }

  private async validateParentFolder(parentId: string, userId: string) {
    const parent = await this.fileRepository.findOne({
      where: { id: parentId, owner: { id: userId } },
    });
    if (!parent) throw new NotFoundException('Целевая папка не найдена');
    if (!parent.isFolder)
      throw new BadRequestException(
        'Указанный родительский объект не является папкой',
      );
    if (parent.isInTrash)
      throw new BadRequestException('Нельзя добавлять файлы в удаленную папку');
  }

  private async toggleTrashStateRecursive(
    item: FileEntity,
    isInTrash: boolean,
  ) {
    item.isInTrash = isInTrash;
    item.deletedAt = isInTrash ? new Date() : null;
    await this.fileRepository.save(item);

    if (item.isFolder) {
      const children = await this.fileRepository.find({
        where: { parentId: item.id },
      });
      for (const child of children) {
        await this.toggleTrashStateRecursive(child, isInTrash);
      }
    }
  }
}
