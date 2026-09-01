import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { AuthMethod } from 'src/auth/enums/auth-method.enum';
import { hash } from 'argon2';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async findById(id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: {
        accounts: true,
      },
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
    const existingUser = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (existingUser)
      throw new ConflictException('Пользователь с таким email уже существует');

    const hashedPassword = dto.password ? await hash(dto.password) : '';

    const user = this.userRepository.create({
      email: dto.email,
      password: hashedPassword,
      displayName: dto.displayName,
      picture: dto.picture,
      method: dto.method,
      isVerified: dto.isVerified ?? false,
    });

    return user;
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
    });

    return this.userRepository.save(user);
  }
}
