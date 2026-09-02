import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { type Request } from 'express';

import { ConfirmationDto } from './dto/confirmation.dto';
import { EmailConfirmationService } from './email-confirmation.service';
import { User } from '@/user/entities/user.entity';

@ApiTags('Email Confirmation')
@Controller('auth/email-confirmation')
export class EmailConfirmationController {
  public constructor(
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Подтверждение адреса электронной почты по токену' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: User,
    description:
      'Email успешно подтвержден, пользователь авторизован и сессия создана',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Токен подтверждения или пользователь не найден',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Срок действия токена подтверждения истек',
  })
  public async newVerification(
    @Req() req: Request,
    @Body() dto: ConfirmationDto,
  ): Promise<User> {
    return this.emailConfirmationService.newVerification(req, dto);
  }
}
