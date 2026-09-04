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
import {
  FilesQueryDto,
  FilesSortFields,
  SortOrder,
} from './dto/files-query.dto';
import { PaginatedFilesResponse } from './entities/paginated-files';
import { RenameFileDto } from './dto/rename-file.dto';
import { S3Service } from '@/shared/s3.service';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly s3Service: S3Service,
  ) {}

  async uploadFile(
    user: User,
    file: Express.Multer.File,
    parentId?: string,
  ): Promise<FileEntity> {
    const tariff = user.tariffPlan;
    const maxFileSize = tariff ? Number(tariff.maxFileSize) : 104857600;
    const maxSpace = tariff ? Number(tariff.maxSpace) : 5368709120;

    if (file.size > maxFileSize) {
      throw new BadRequestException(
        'Размер файла превышает лимит вашего тарифного плана.',
      );
    }

    const futureUsedSpace = Number(user.usedSpace) + file.size;
    if (futureUsedSpace > maxSpace) {
      throw new BadRequestException(
        'Недостаточно свободного места в облачном хранилище.',
      );
    }

    if (parentId) {
      await this.validateParentFolder(parentId, user.id);
    }

    const fileId = crypto.randomUUID();
    const extension = file.originalname.split('.').pop();
    const s3Key = `users/${user.id}/${fileId}${extension ? `.${extension}` : ''}`;

    try {
      await this.s3Service.uploadFile(s3Key, file.buffer, file.mimetype);

      const newFile = this.fileRepository.create({
        id: fileId,
        name: file.originalname,
        s3Key,
        size: file.size,
        mimeType: file.mimetype,
        isFolder: false,
        parentId: parentId || null,
        owner: user,
      });

      const savedFile = await this.fileRepository.save(newFile);

      user.usedSpace = futureUsedSpace;
      await this.userRepository.save(user);

      return savedFile;
    } catch (error) {
      throw new BadRequestException(
        'Не удалось загрузить файл. Попробуйте позже.',
      );
    }
  }

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

  async getFiles(
    userId: string,
    queryDto: FilesQueryDto,
  ): Promise<PaginatedFilesResponse> {
    const {
      parentId,
      search,
      sortBy,
      order,
      page = 1,
      limit = 20,
      isInTrash = false,
    } = queryDto;

    const queryBuilder = this.fileRepository
      .createQueryBuilder('file')
      .where('file.owner_id = :userId', { userId })
      .andWhere('file.is_in_trash = :isInTrash', { isInTrash });

    if (search) {
      queryBuilder.andWhere('file.name ILIKE :search', {
        search: `%${search}%`,
      });
    } else if (!isInTrash) {
      if (parentId) {
        queryBuilder.andWhere('file.parent_id = :parentId', { parentId });
      } else {
        queryBuilder.andWhere('file.parent_id IS NULL');
      }
    }

    const sortColumn =
      sortBy === FilesSortFields.SIZE
        ? 'file.size'
        : sortBy === FilesSortFields.DATE
          ? 'file.created_at'
          : 'file.name';

    queryBuilder
      .orderBy('file.is_folder', 'DESC')
      .addOrderBy(sortColumn, order || SortOrder.ASC)
      .skip((page - 1) * limit)
      .take(limit);

    const [items, totalItems] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(totalItems / limit);

    return {
      items,
      meta: {
        totalItems,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
      },
    };
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

  async rename(
    id: string,
    userId: string,
    dto: RenameFileDto,
  ): Promise<FileEntity> {
    const file = await this.fileRepository.findOne({
      where: { id, owner: { id: userId } },
    });
    if (!file) {
      throw new NotFoundException('Объект не найден');
    }

    if (file.isFolder) {
      file.name = dto.name;
    } else {
      const oldExtension = file.name.split('.').pop();
      const newExtension = dto.name.split('.').pop();

      if (oldExtension && oldExtension !== newExtension) {
        file.name = `${dto.name}.${oldExtension}`;
      } else {
        file.name = dto.name;
      }
    }

    return this.fileRepository.save(file);
  }

  async getBreadcrumbs(id: string, userId: string): Promise<FileEntity[]> {
    const breadcrumbs: FileEntity[] = [];
    let currentId: string | null = id;

    while (currentId) {
      const folder = await this.fileRepository.findOne({
        where: { id: currentId, owner: { id: userId }, isFolder: true },
      });

      if (!folder) break;

      breadcrumbs.unshift(folder);
      currentId = folder.parentId;
    }

    return breadcrumbs;
  }

  async getFileStream(id: string, userId: string) {
    const file = await this.fileRepository.findOne({
      where: { id, owner: { id: userId }, isFolder: false },
    });

    if (!file) {
      throw new NotFoundException('Файл не найден');
    }

    if (file.isInTrash) {
      throw new BadRequestException(
        'Нельзя скачать файл из корзины. Сначала восстановите его.',
      );
    }

    if (!file.s3Key) {
      throw new BadRequestException('Файл не содержит валидный ключ хранилища');
    }

    const stream = await this.s3Service.getFileStream(file.s3Key);

    return {
      stream,
      filename: file.name,
      mimeType: file.mimeType,
    };
  }

  async deleteForever(
    id: string,
    userId: string,
  ): Promise<{ success: boolean }> {
    const item = await this.fileRepository.findOne({
      where: { id, owner: { id: userId } },
      relations: ['owner'],
    });

    if (!item) {
      throw new NotFoundException('Объект не найден');
    }

    if (!item.isInTrash) {
      throw new BadRequestException(
        'Уничтожить навсегда можно только объекты, находящиеся в корзине',
      );
    }

    const user = item.owner;
    let totalFreedSpace = 0;

    const collectAndDelete = async (currentItem: FileEntity) => {
      if (currentItem.isFolder) {
        const children = await this.fileRepository.find({
          where: { parentId: currentItem.id },
        });
        for (const child of children) {
          await collectAndDelete(child);
        }
      } else {
        if (currentItem.s3Key) {
          await this.s3Service.deleteFile(currentItem.s3Key);
        }
        totalFreedSpace += Number(currentItem.size);
      }

      await this.fileRepository.remove(currentItem);
    };

    await collectAndDelete(item);

    if (totalFreedSpace > 0 && user) {
      user.usedSpace = Math.max(0, Number(user.usedSpace) - totalFreedSpace);
      await this.userRepository.save(user);
    }

    return { success: true };
  }

  async move(
    id: string,
    userId: string,
    targetParentId: string | null,
  ): Promise<FileEntity> {
    const item = await this.fileRepository.findOne({
      where: { id, owner: { id: userId } },
    });

    if (!item) {
      throw new NotFoundException('Объект не найден');
    }

    if (item.isInTrash) {
      throw new BadRequestException(
        'Нельзя перемещать объекты, находящиеся в корзине',
      );
    }

    if (targetParentId) {
      if (id === targetParentId) {
        throw new BadRequestException('Нельзя переместить папку саму в себя');
      }

      await this.validateParentFolder(targetParentId, userId);

      if (item.isFolder) {
        let currentParentId: string | null = targetParentId;

        while (currentParentId) {
          const parent = await this.fileRepository.findOne({
            where: { id: currentParentId },
          });
          if (parent?.parentId === id) {
            throw new BadRequestException(
              'Нельзя переместить родительскую папку во вложенную подпапку',
            );
          }
          currentParentId = parent?.parentId || null;
        }
      }
    }

    item.parentId = targetParentId || null;
    return this.fileRepository.save(item);
  }
}
