import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmationDto {
  @ApiProperty({ example: 'jupv08fa884ehrmcwh5cy4pamm' })
  @IsString({ message: 'Токен должен быть строкой.' })
  @IsNotEmpty({ message: 'Поле токен не может быть пустым.' })
  token!: string;
}
