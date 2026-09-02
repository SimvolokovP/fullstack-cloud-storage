import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Token } from './entities/token.entity';
import { User } from '../user/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getRecaptchaConfig } from 'src/config/recaptcha.config';
import { PassportModule } from '@nestjs/passport';
import { OAuthController } from './oauth.controller';
import { YandexStrategy } from './strategies/yandex.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, Token, User]),
    UserModule,
    PassportModule.register({ session: true }),
    GoogleRecaptchaModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getRecaptchaConfig,
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController, OAuthController],
  providers: [AuthService, YandexStrategy],
  exports: [AuthService],
})
export class AuthModule {}
