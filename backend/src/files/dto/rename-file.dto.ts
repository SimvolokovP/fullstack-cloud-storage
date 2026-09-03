import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class RenameFileDto {
  @ApiProperty({ example: 'Новый отчет' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;
}
