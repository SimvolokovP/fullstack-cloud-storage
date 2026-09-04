import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';

@Injectable()
export class S3Service implements OnModuleInit {
  private s3Client!: S3Client;
  private bucketName!: string;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.bucketName = this.configService.getOrThrow<string>('S3_BUCKET_NAME');
    this.s3Client = new S3Client({
      endpoint: this.configService.getOrThrow<string>('S3_ENDPOINT'),
      region: this.configService.get<string>('S3_REGION') || 'us-east-1',
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('S3_ACCESS_KEY'),
        secretAccessKey: this.configService.getOrThrow<string>('S3_SECRET_KEY'),
      },
      forcePathStyle: true,
    });
  }

  async uploadFile(
    key: string,
    buffer: Buffer,
    mimeType: string,
  ): Promise<void> {
    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: buffer,
          ContentType: mimeType,
        }),
      );
    } catch (error) {
      console.error('AWS S3 Upload Error details:', error);
      throw new BadRequestException(
        'Ошибка при загрузке файла в облачное хранилища',
      );
    }
  }

  async getFileStream(key: string): Promise<any> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const response = await this.s3Client.send(command);
      return response.Body;
    } catch (error) {
      console.error('AWS S3 Get Error details:', error);
      throw new BadRequestException(
        'Ошибка при чтении файла из облачного хранилища',
      );
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
    } catch (error) {
      console.error('AWS S3 Delete Error details:', error);
      throw new BadRequestException(
        'Ошибка при удалении файла из облачного хранилища',
      );
    }
  }
}
