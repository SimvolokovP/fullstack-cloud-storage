import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsBoolean, IsString, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'new-email@example.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'John New Name', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isTwoFactorEnabled?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;
}
