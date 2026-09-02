import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { render } from '@react-email/render';
import * as React from 'react';
import { ConfirmationTemplate } from './templates/confirmation.template';
import { PasswordResetTemplate } from './templates/password-reset.template';

@Processor('mail_queue')
export class MailProcessor extends WorkerHost {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  async process(job: Job<{ email: string; token: string }>): Promise<void> {
    const { email, token } = job.data;
    const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN');

    if (job.name === 'send_confirmation') {
      const html = await render(
        React.createElement(ConfirmationTemplate, { domain, token }),
      );

      await this.mailerService.sendMail({
        to: email,
        subject: 'Подтверждение регистрации',
        html: html,
      });
    }

    if (job.name === 'send_password_reset') {
      const html = await render(
        React.createElement(PasswordResetTemplate, { domain, token }),
      );

      await this.mailerService.sendMail({
        to: email,
        subject: 'Восстановление пароля',
        html: html,
      });
    }
  }
}
