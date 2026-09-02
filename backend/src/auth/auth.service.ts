import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthMethod } from './enums/auth-method.enum';
import { LoginDto } from './dto/login.dto';
import { verify } from 'argon2';
import { Request, Response } from 'express';
import { Session, SessionData } from 'express-session';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  public constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async register(req: Request, dto: RegisterDto) {
    const isExists = await this.userService.findByEmail(dto.email);

    if (isExists) {
      throw new ConflictException(
        'Регистрация не удалась. Пользователь с таким email уже существует. Пожалуйста, используйте другой email или войдите в систему.',
      );
    }

    const newUser = await this.userService.create({
      email: dto.email,
      password: dto.password,
      displayName: dto.name,
      picture: '',
      method: AuthMethod.CREDENTIALS,
      isVerified: false,
    });

    return this.saveSession(req, newUser);
  }

  async login(req: Request, dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);

    if (!user || !user.password) {
      throw new UnauthorizedException(
        'Неверный пароль. Пожалуйста, попробуйте еще раз или восстановите пароль, если забыли его.',
      );
    }

    const isPasswordValid = await verify(user.password, dto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Неверный пароль. Пожалуйста, попробуйте еще раз или восстановите пароль, если забыли его.',
      );
    }

    if (!user.isVerified) {
      throw new UnauthorizedException(
        'Ваш email не подтвержден. Пожалуйста, проверьте вашу почту и подтвердите адрес.',
      );
    }

    return this.saveSession(req, user);
  }

  async logout(req: Request, res: Response): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          return reject(
            new InternalServerErrorException(
              'Не удалось завершить сессию. Возможно, возникла проблема с сервером или сессия уже была завершена.',
            ),
          );
        }
        res.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'));
        resolve();
      });
    });
  }

  async saveSession(req: Request, user: User) {
    const sessionRequest = req as Request & {
      session?: Session & Partial<SessionData> & { userId?: string };
    };

    if (!sessionRequest.session) {
      throw new InternalServerErrorException(
        'Модуль сессий не инициализирован. Проверьте конфигурацию Redis и Express Session.',
      );
    }

    return new Promise<User>((resolve, reject) => {
      sessionRequest.session!.userId = user.id;

      sessionRequest.session!.save((err: any) => {
        if (err) {
          console.error('Ошибка сохранения сессии в Redis:', err);

          return reject(
            new InternalServerErrorException(
              `Не удалось保存 сессию в хранилище Redis: ${err.message || err}`,
            ),
          );
        }
        resolve(user);
      });
    });
  }

  async validateOAuthUser(oauthUser: {
    email: string;
    displayName: string;
    picture: string | null;
    accessToken: string;
    refreshToken: string;
  }): Promise<User> {
    let user = await this.userService.findByEmail(oauthUser.email);

    if (!user) {
      user = await this.userService.create({
        email: oauthUser.email,
        password: '',
        displayName: oauthUser.displayName,
        picture: oauthUser.picture || '',
        method: AuthMethod.YANDEX,
        isVerified: true,
      });
    }

    let account = await this.accountRepository.findOne({
      where: {
        provider: 'yandex',
        userId: user.id,
      },
    });

    if (account) {
      account.accessToken = oauthUser.accessToken;
      account.refreshToken = oauthUser.refreshToken;
      await this.accountRepository.save(account);
    } else {
      account = this.accountRepository.create({
        type: 'oauth',
        provider: 'yandex',
        accessToken: oauthUser.accessToken,
        refreshToken: oauthUser.refreshToken,
        userId: user.id,
      });
      await this.accountRepository.save(account);
    }

    return user;
  }
}
