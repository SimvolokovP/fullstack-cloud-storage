import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class NewPasswordDto {
  @ApiProperty({ example: 'newsecurepassword123' })
  @IsString({ message: 'Пароль должен быть строкой.' })
  @IsNotEmpty({ message: 'Пароль обязателен для заполнения.' })
  @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов.' })
  password!: string;
}
