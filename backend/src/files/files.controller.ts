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
  Res,
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
import { FilesQueryDto } from './dto/files-query.dto';
import { PaginatedFilesResponse } from './entities/paginated-files';
import { RenameFileDto } from './dto/rename-file.dto';
import { type Response } from 'express';

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
  @ApiOperation({
    summary: 'Получить содержимое директории или корзины с пагинацией',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Успешное получение списка объектов',
  })
  @Authorization()
  async getFiles(
    @Authorized('id') userId: string,
    @Query() queryDto: FilesQueryDto,
  ): Promise<PaginatedFilesResponse> {
    return this.filesService.getFiles(userId, queryDto);
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

  @Patch(':id/rename')
  @ApiOperation({ summary: 'Переименовать файл или папку' })
  @ApiResponse({ status: HttpStatus.OK, type: FileEntity })
  @Authorization()
  async rename(
    @Param('id', ParseUUIDPipe) id: string,
    @Authorized('id') userId: string,
    @Body() dto: RenameFileDto,
  ): Promise<FileEntity> {
    return this.filesService.rename(id, userId, dto);
  }

  @Get(':id/breadcrumbs')
  @ApiOperation({
    summary: 'Получить цепочку родительских папок для хлебных крошек',
  })
  @ApiResponse({ status: HttpStatus.OK, type: [FileEntity] })
  @Authorization()
  async getBreadcrumbs(
    @Param('id', ParseUUIDPipe) id: string,
    @Authorized('id') userId: string,
  ): Promise<FileEntity[]> {
    return this.filesService.getBreadcrumbs(id, userId);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Загрузить файл в облако' })
  @ApiQuery({ name: 'parentId', required: false, description: 'UUID папки' })
  @ApiResponse({ status: HttpStatus.CREATED, type: FileEntity })
  @Authorization()
  async uploadFile(
    @Authorized() user: User,
    @UploadedFile() file: Express.Multer.File,
    @Query('parentId') parentId?: string,
  ): Promise<FileEntity> {
    return this.filesService.uploadFile(user, file, parentId);
  }

  @Get('download/:id')
  @ApiOperation({ summary: 'Скачать файл по ID' })
  @Authorization()
  async download(
    @Param('id', ParseUUIDPipe) id: string,
    @Authorized('id') userId: string,
    @Res() res: Response,
  ) {
    const { stream, filename, mimeType } =
      await this.filesService.getFileStream(id, userId);

    res.set({
      'Content-Type': mimeType || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
    });

    stream.pipe(res);
  }

  @Delete(':id/forever')
  @ApiOperation({ summary: 'Удалить файл или папку навсегда' })
  @Authorization()
  async deleteForever(
    @Param('id', ParseUUIDPipe) id: string,
    @Authorized('id') userId: string,
  ) {
    return this.filesService.deleteForever(id, userId);
  }

  @Patch(':id/move')
  @ApiOperation({ summary: 'Переместить файл или папку в другую директорию' })
  @ApiResponse({ status: HttpStatus.OK, type: FileEntity })
  @Authorization()
  async move(
    @Param('id', ParseUUIDPipe) id: string,
    @Authorized('id') userId: string,
    @Body('targetParentId') targetParentId: string | null,
  ): Promise<FileEntity> {
    return this.filesService.move(id, userId, targetParentId);
  }
}
