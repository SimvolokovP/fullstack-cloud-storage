import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  ParseUUIDPipe,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Authorization } from '@/auth/decorators/auth.decorator';
import { ChangeEmailDto } from './dto/сhange-email.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Создать нового пользователя' })
  @ApiResponse({ status: HttpStatus.CREATED, type: User })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email уже существует',
  })
  async create(@Body() dto: CreateUserDto): Promise<User> {
    return this.userService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить пользователя по ID' })
  @ApiParam({ name: 'id', type: String, description: 'UUID пользователя' })
  @ApiResponse({ status: HttpStatus.OK, type: User })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Пользователь не найден',
  })
  @Authorization()
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    return this.userService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновить основные данные профиля пользователя' })
  @ApiParam({ name: 'id', type: String, description: 'UUID пользователя' })
  @ApiResponse({ status: HttpStatus.OK, type: User })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Пользователь не найден',
  })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Email уже занят' })
  @Authorization()
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, dto);
  }

  @Patch(':id/password')
  @ApiOperation({ summary: 'Безопасное изменение пароля пользователя' })
  @ApiParam({ name: 'id', type: String, description: 'UUID пользователя' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Пароль успешно обновлен',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Неверный старый пароль',
  })
  @Authorization()
  async changePassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.userService.changePassword(id, dto);
  }

  @Patch(':id/email')
  @ApiOperation({
    summary: 'Смена адреса электронной почты с повторной верификацией',
  })
  @ApiParam({ name: 'id', type: String, description: 'UUID пользователя' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Email изменен, токен подтверждения отправлен',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Новый email уже занят',
  })
  @Authorization()
  async changeEmail(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ChangeEmailDto,
  ) {
    return this.userService.changeEmail(id, dto);
  }
}
