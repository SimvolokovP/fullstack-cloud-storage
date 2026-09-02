import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'oldpassword123' })
  @IsString({ message: 'Старый пароль должен быть строкой.' })
  @IsNotEmpty({ message: 'Поле не может быть пустым.' })
  oldPassword!: string;

  @ApiProperty({ example: 'newpassword123' })
  @IsString({ message: 'Новый пароль должен быть строкой.' })
  @IsNotEmpty({ message: 'Поле не может быть пустым.' })
  @MinLength(6, {
    message: 'Новый пароль должен содержать минимум 6 символов.',
  })
  newPassword!: string;
}
