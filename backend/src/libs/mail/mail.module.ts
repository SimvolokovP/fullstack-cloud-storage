import { Module, Global } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const port = config.get<number>('MAIL_PORT') || 587;

        return {
          transport: {
            host: config.get<string>('MAIL_HOST'),
            port: port,
            secure: false,
            auth: {
              user: config.get<string>('MAIL_USER'),
              pass: config.get<string>('MAIL_PASSWORD'),
            },
            tls: {
              requireTLS: true,
              rejectUnauthorized: false,
            },
          },
          defaults: {
            from: config.get<string>('MAIL_FROM'),
          },
        };
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
