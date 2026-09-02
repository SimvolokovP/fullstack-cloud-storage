import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { hash, verify } from 'argon2';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { EmailConfirmationService } from '../auth/email-confirmation/email-confirmation.service';
import { ChangeEmailDto } from './dto/сhange-email.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => EmailConfirmationService))
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  async findById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { accounts: true },
    });

    if (!user) {
      throw new NotFoundException(
        'Пользователь не найден. Пожалуйста, проверьте введенные данные.',
      );
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
      relations: { accounts: true },
    });
  }

  async create(dto: CreateUserDto) {
    const hashedPassword = dto.password ? await hash(dto.password) : '';

    const user = this.userRepository.create({
      email: dto.email,
      password: hashedPassword,
      displayName: dto.displayName,
      picture: dto.picture,
      method: dto.method,
      isVerified: dto.isVerified ?? false,
    });

    return this.userRepository.save(user);
  }

  async update(userId: string, dto: UpdateUserDto) {
    const user = await this.findById(userId);

    if (dto.email && dto.email !== user.email) {
      const emailExists = await this.userRepository.findOne({
        where: { email: dto.email },
      });
      if (emailExists) {
        throw new ConflictException(
          'Этот email уже занят другим пользователем',
        );
      }
    }

    this.userRepository.merge(user, {
      email: dto.email,
      displayName: dto.name,
      isTwoFactorEnabled: dto.isTwoFactorEnabled,
      isVerified: dto.isVerified,
    });

    return this.userRepository.save(user);
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.findById(userId);

    if (!user.password) {
      throw new BadRequestException(
        'У вашего аккаунта не установлен пароль (вход через OAuth). Создайте обращение в поддержку.',
      );
    }

    const isPasswordValid = await verify(user.password, dto.oldPassword);
    if (!isPasswordValid) {
      throw new BadRequestException('Текущий пароль указан неверно.');
    }

    user.password = await hash(dto.newPassword);
    await this.userRepository.save(user);

    return { message: 'Пароль успешно изменен.' };
  }

  async changeEmail(userId: string, dto: ChangeEmailDto) {
    const user = await this.findById(userId);

    if (user.email === dto.newEmail) {
      throw new BadRequestException('Новый email совпадает с текущим.');
    }

    const emailExists = await this.userRepository.findOne({
      where: { email: dto.newEmail },
    });
    if (emailExists) {
      throw new ConflictException('Этот email уже занят другим пользователем.');
    }

    user.email = dto.newEmail;
    user.isVerified = false;
    await this.userRepository.save(user);

    await this.emailConfirmationService.sendVerificationToken(user.email);

    return {
      message:
        'Email успешно изменен. На новый адрес отправлено письмо для подтверждения.',
    };
  }
}
