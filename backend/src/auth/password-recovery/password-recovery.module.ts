import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PasswordRecoveryController } from './password-recovery.controller';
import { PasswordRecoveryService } from './password-recovery.service';
import { Token } from '../entities/token.entity';
import { UserModule } from '@/user/user.module';
import { MailModule } from '@/libs/mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([Token]), UserModule, MailModule],
  controllers: [PasswordRecoveryController],
  providers: [PasswordRecoveryService],
  exports: [PasswordRecoveryService],
})
export class PasswordRecoveryModule {}
