import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Token } from './entities/token.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account, Token, User])],
  controllers: [],
  providers: [],
  exports: [],
})
export class AuthModule {}
