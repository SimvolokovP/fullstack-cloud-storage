import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash } from 'argon2';
import { v4 as uuidv4 } from 'uuid';

import { ResetPasswordDto } from './dto/reset-password.dto';
import { NewPasswordDto } from './dto/new-password.dto';
import { Token } from '../entities/token.entity';
import { UserService } from '@/user/user.service';
import { MailService } from '@/libs/mail/mail.service';
import { TokenType } from '../enums/token-type.enum';

@Injectable()
export class PasswordRecoveryService {
  public constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}

  public async reset(dto: ResetPasswordDto): Promise<boolean> {
    const existingUser = await this.userService.findByEmail(dto.email);

    if (!existingUser) {
      throw new NotFoundException(
        'Пользователь не найден. Пожалуйста, проверьте введенный адрес электронной почты и попробуйте снова.',
      );
    }

    const passwordResetToken = await this.generatePasswordResetToken(
      existingUser.email,
    );

    await this.mailService.sendPasswordResetEmail(
      passwordResetToken.email,
      passwordResetToken.token,
    );

    return true;
  }

  public async new(dto: NewPasswordDto, token: string): Promise<boolean> {
    const existingToken = await this.tokenRepository.findOne({
      where: {
        token,
        type: TokenType.PASSWORD_RESET,
      },
    });

    if (!existingToken) {
      throw new NotFoundException(
        'Токен не найден. Пожалуйста, проверьте правильность введенного токена или запросите новый.',
      );
    }

    const hasExpired = new Date(existingToken.expiresIn) < new Date();

    if (hasExpired) {
      throw new BadRequestException(
        'Токен истек. Пожалуйста, запросите новый токен для подтверждения сброса пароля.',
      );
    }

    const existingUser = await this.userService.findByEmail(
      existingToken.email,
    );

    if (!existingUser) {
      throw new NotFoundException(
        'Пользователь не найден. Пожалуйста, проверьте введенный адрес электронной почты и попробуйте снова.',
      );
    }

    const hashedPassword = await hash(dto.password);
    await this.userService.update(existingUser.id, {
      password: hashedPassword,
    } as any);

    await this.tokenRepository.delete({
      id: existingToken.id,
    });

    return true;
  }

  private async generatePasswordResetToken(email: string): Promise<Token> {
    const token = uuidv4();
    const expiresIn = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await this.tokenRepository.findOne({
      where: {
        email,
        type: TokenType.PASSWORD_RESET,
      },
    });

    if (existingToken) {
      await this.tokenRepository.delete({
        id: existingToken.id,
      });
    }

    const passwordResetToken = this.tokenRepository.create({
      email,
      token,
      expiresIn,
      type: TokenType.PASSWORD_RESET,
    });

    return this.tokenRepository.save(passwordResetToken);
  }
}
