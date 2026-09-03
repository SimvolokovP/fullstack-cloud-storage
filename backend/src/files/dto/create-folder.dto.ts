import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateFolderDto {
  @ApiProperty({ example: 'Новая папка' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 'c2b07384-d113-49c6-a5e1-7d13f9f74351',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  parentId?: string;
}
