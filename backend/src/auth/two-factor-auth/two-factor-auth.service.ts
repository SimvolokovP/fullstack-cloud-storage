import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from '../entities/token.entity';
import { MailService } from '@/libs/mail/mail.service';
import { TokenType } from '../enums/token-type.enum';


@Injectable()
export class TwoFactorAuthService {
  public constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private readonly mailService: MailService,
  ) {}

  public async validateTwoFactorToken(
    email: string,
    code: string,
  ): Promise<boolean> {
    const existingToken = await this.tokenRepository.findOne({
      where: {
        email,
        type: TokenType.TWO_FACTOR,
      },
    });

    if (!existingToken) {
      throw new NotFoundException(
        'Токен двухфакторной аутентификации не найден. Убедитесь, что вы запрашивали токен для данного адреса электронной почты.',
      );
    }

    if (existingToken.token !== code) {
      throw new BadRequestException(
        'Неверный код двухфакторной аутентификации. Пожалуйста, проверьте введенный код и попробуйте снова.',
      );
    }

    const hasExpired = new Date(existingToken.expiresIn) < new Date();

    if (hasExpired) {
      throw new BadRequestException(
        'Срок действия токена двухфакторной аутентификации истек. Пожалуйста, запросите новый токен.',
      );
    }

    await this.tokenRepository.delete({
      id: existingToken.id,
    });

    return true;
  }

  public async sendTwoFactorToken(email: string): Promise<boolean> {
    const twoFactorToken = await this.generateTwoFactorToken(email);

    await this.mailService.sendTwoFactorTokenEmail(
      twoFactorToken.email,
      twoFactorToken.token,
    );

    return true;
  }

  private async generateTwoFactorToken(email: string): Promise<Token> {
    const token = Math.floor(
      Math.random() * (1000000 - 100000) + 100000,
    ).toString();
    const expiresIn = new Date(new Date().getTime() + 300000);

    const existingToken = await this.tokenRepository.findOne({
      where: {
        email,
        type: TokenType.TWO_FACTOR,
      },
    });

    if (existingToken) {
      await this.tokenRepository.delete({
        id: existingToken.id,
      });
    }

    const twoFactorToken = this.tokenRepository.create({
      email,
      token,
      expiresIn,
      type: TokenType.TWO_FACTOR,
    });

    return this.tokenRepository.save(twoFactorToken);
  }
}
