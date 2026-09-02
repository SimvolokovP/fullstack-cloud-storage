import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class MailService {
  constructor(@InjectQueue('mail_queue') private readonly mailQueue: Queue) {}

  async sendConfirmationEmail(email: string, token: string): Promise<void> {
    await this.mailQueue.add(
      'send_confirmation',
      { email, token },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
        removeOnComplete: true,
      },
    );
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    await this.mailQueue.add(
      'send_password_reset',
      { email, token },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: true,
      },
    );
  }
}
