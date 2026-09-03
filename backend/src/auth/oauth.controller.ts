import {
  Controller,
  Get,
  UseGuards,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request, type Response } from 'express';
import { AuthService } from './auth.service';

@ApiTags('OAuth Authentication')
@Controller('auth/oauth')
export class OAuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('connect/yandex')
  @UseGuards(AuthGuard('yandex'))
  @ApiOperation({
    summary: 'Перенаправление пользователя на страницу авторизации Яндекс',
  })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: 'Перенаправление на Яндекс OAuth',
  })
  async yandexAuth() {}

  @Get('callback/yandex')
  @UseGuards(AuthGuard('yandex'))
  @ApiOperation({ summary: 'Callback-эндпоинт для обработки ответа от Яндекс' })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: 'Успешная авторизация, редирект в личный кабинет',
  })
  async yandexAuthCallback(
    @Req() req: Request & { user?: any },
    @Res() res: Response,
  ) {
    return this.authService.handleYandexCallback(req, res);
  }
}
