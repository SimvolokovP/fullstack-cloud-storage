import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Token } from '../entities/token.entity';
import { MailModule } from '@/libs/mail/mail.module';
import { TwoFactorAuthService } from './two-factor-auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([Token]), MailModule],
  providers: [TwoFactorAuthService],
  exports: [TwoFactorAuthService],
})
export class TwoFactorAuthModule {}
