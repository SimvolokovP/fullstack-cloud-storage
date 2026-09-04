import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { FileEntity } from './entities/file.entity';
import { User } from '@/user/entities/user.entity';
import { UserModule } from '@/user/user.module';
import { S3Service } from '@/shared/s3.service';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity, User]), UserModule],
  controllers: [FilesController],
  providers: [FilesService, S3Service],
  exports: [FilesService],
})
export class FilesModule {}
