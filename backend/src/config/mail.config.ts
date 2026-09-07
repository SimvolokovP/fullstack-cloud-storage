import { ConfigService } from '@nestjs/config';
import { MailerOptions } from '@nestjs-modules/mailer';

export const getMailConfig = (config: ConfigService): MailerOptions => {
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
      from: `"Cloud box" <${config.get('MAIL_FROM')}>`,
    },
  };
};
