import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

import { ResetPasswordDto } from './dto/reset-password.dto';
import { NewPasswordDto } from './dto/new-password.dto';
import { PasswordRecoveryService } from './password-recovery.service';

@ApiTags('Password Recovery')
@Controller('auth/password-recovery')
export class PasswordRecoveryController {
  public constructor(
    private readonly passwordRecoveryService: PasswordRecoveryService,
  ) {}

  @Post('reset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Запрос на сброс пароля (отправка email-токена)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Ссылка для сброса пароля успешно отправлена на указанный email',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Пользователь с таким email не зарегистрирован в системе',
  })
  public async reset(@Body() dto: ResetPasswordDto): Promise<boolean> {
    return this.passwordRecoveryService.reset(dto);
  }

  @Post('new/:token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Установка нового пароля по токену сброса' })
  @ApiParam({
    name: 'token',
    type: String,
    description: 'UUID токена восстановления пароля, полученный из письма',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Пароль пользователя был успешно изменен',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Указанный токен сброса или пользователь не найдены',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Срок действия токена сброса пароля истек',
  })
  public async new(
    @Param('token') token: string,
    @Body() dto: NewPasswordDto,
  ): Promise<boolean> {
    return this.passwordRecoveryService.new(dto, token);
  }
}
