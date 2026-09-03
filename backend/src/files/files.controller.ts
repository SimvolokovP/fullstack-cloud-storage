import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiQuery,
} from '@nestjs/swagger';
import { FilesService } from './files.service';
import { FileEntity } from './entities/file.entity';
import { CreateFolderDto } from './dto/create-folder.dto';
import { Authorization } from '@/auth/decorators/auth.decorator';
import { Authorized } from '@/auth/decorators/authorized.decorator';
import { User } from '../user/entities/user.entity';

@ApiTags('Files Manager')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('folder')
  @ApiOperation({ summary: 'Создать новую папку' })
  @ApiResponse({ status: HttpStatus.CREATED, type: FileEntity })
  @Authorization()
  async createFolder(
    @Authorized() user: User,
    @Body() dto: CreateFolderDto,
  ): Promise<FileEntity> {
    return this.filesService.createFolder(user, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить содержимое текущей директории' })
  @ApiQuery({ name: 'parentId', required: false })
  @ApiResponse({ status: HttpStatus.OK, type: [FileEntity] })
  @Authorization()
  async getFiles(
    @Authorized('id') userId: string,
    @Query('parentId') parentId?: string,
  ): Promise<FileEntity[]> {
    return this.filesService.getFiles(userId, parentId);
  }

  @Get('trash')
  @ApiOperation({ summary: 'Получить список объектов в корзине' })
  @ApiResponse({ status: HttpStatus.OK, type: [FileEntity] })
  @Authorization()
  async getTrash(@Authorized('id') userId: string): Promise<FileEntity[]> {
    return this.filesService.getTrash(userId);
  }

  @Patch(':id/trash')
  @ApiOperation({ summary: 'Переместить файл или папку в корзину' })
  @Authorization()
  async moveToTrash(
    @Param('id', ParseUUIDPipe) id: string,
    @Authorized('id') userId: string,
  ) {
    return this.filesService.moveToTrash(id, userId);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Восстановить файл или папку из корзины' })
  @Authorization()
  async restoreFromTrash(
    @Param('id', ParseUUIDPipe) id: string,
    @Authorized('id') userId: string,
  ) {
    return this.filesService.restoreFromTrash(id, userId);
  }
}
