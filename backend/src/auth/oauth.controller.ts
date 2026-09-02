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
import { ConfigService } from '@nestjs/config';
import { type Request, type Response } from 'express';
import { AuthService } from './auth.service';

@ApiTags('OAuth Authentication')
@Controller('auth/oauth')
export class OAuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

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
  async yandexAuthCallback(@Req() req: Request, @Res() res: Response) {
    const passportRequest = req as Request & {
      user: {
        email: string;
        displayName: string;
        picture: string | null;
        accessToken: string;
        refreshToken: string;
      };
    };

    const user = await this.authService.validateOAuthUser(passportRequest.user);
    await this.authService.saveSession(req, user);

    const redirectUrl = this.configService.getOrThrow<string>(
      'YANDEX_CALLBACK_URL',
    );
    return res.redirect(redirectUrl);
  }
}
