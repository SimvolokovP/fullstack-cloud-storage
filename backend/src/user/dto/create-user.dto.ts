import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsBoolean,
  IsString,
  IsOptional,
} from 'class-validator';
import { AuthMethod } from '../../auth/enums/auth-method.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'password123', required: false })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  displayName!: string;

  @ApiProperty({ example: 'https://example.com', required: false })
  @IsString()
  @IsOptional()
  picture?: string;

  @ApiProperty({ enum: AuthMethod, example: AuthMethod.CREDENTIALS })
  @IsEnum(AuthMethod)
  method!: AuthMethod;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;
}
