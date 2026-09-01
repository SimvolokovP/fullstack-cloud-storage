import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.dto';
import { AuthMethod } from './enums/auth-method.enum';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  public constructor(private readonly userService: UserService) {}

  async register(dto: RegisterDto) {
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

    // await this.emailConfirmationService.sendVerificationToken(newUser.email);

    return {
      message:
        'Вы успешно зарегистрировались. Пожалуйста, подтвердите ваш email. Сообщение было отправлено на ваш почтовый адрес.',
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);

    if (!user || !user.password) {
      throw new UnauthorizedException(
        'Неверный пароль. Пожалуйста, попробуйте еще раз или восстановите пароль, если забыли его.',
      );
    }

    if (!user.isVerified) {
      //   await this.emailConfirmationService.sendVerificationToken(user.email);
      throw new UnauthorizedException(
        'Ваш email не подтвержден. Пожалуйста, проверьте вашу почту и подтвердите адрес.',
      );
    }

    // if (user.isTwoFactorEnabled) {
    //   if (!dto.code) {
    //     await this.twoFactorAuthService.sendTwoFactorToken(user.email);

    //     return {
    //       message:
    //         'Проверьте вашу почту. Требуется код двухфакторной аутентификации.',
    //     };
    //   }

    //   await this.twoFactorAuthService.validateTwoFactorToken(
    //     user.email,
    //     dto.code,
    //   );
    // }

    // return this.saveSession(req, user);
    return user;
  }
}
