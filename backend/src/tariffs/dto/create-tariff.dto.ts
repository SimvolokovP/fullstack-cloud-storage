import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  Min,
} from 'class-validator';

export class CreateTariffDto {
  @ApiProperty({ example: 'Ultra S3' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: '1 ТБ быстрого S3 хранилища', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 1099511627776 })
  @IsNumber()
  @Min(0)
  maxSpace!: number;

  @ApiProperty({ example: 53687091200 })
  @IsNumber()
  @Min(0)
  maxFileSize!: number;

  @ApiProperty({ example: 999.0 })
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
