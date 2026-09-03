import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-yandex';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class YandexStrategy extends PassportStrategy(Strategy, 'yandex') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.getOrThrow<string>('YANDEX_CLIENT_ID'),
      clientSecret: configService.getOrThrow<string>('YANDEX_CLIENT_SECRET'),
      callbackURL: 'http://localhost:4000/api/auth/oauth/callback/yandex',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    const { displayName, emails, photos, _json } = profile;

    const user = {
      email: emails?.[0]?.value,
      displayName: displayName,
      picture: photos?.[0]?.value,
      accessToken,
      refreshToken,
      expiresIn: _json?.expires_in || 31536000,
    };

    done(null, user);
  }
}
