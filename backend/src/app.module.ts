import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { Account } from './auth/entities/account.entity';
import { IS_DEV_ENV } from './libs/common/utils/is-dev.util';
import { EmailConfirmationModule } from './auth/email-confirmation/email-confirmation.module';
import { Token } from './auth/entities/token.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DB'),
        entities: [User, Account, Token],
        synchronize: IS_DEV_ENV,
      }),
    }),
    UserModule,
    AuthModule,
    EmailConfirmationModule,
  ],
})
export class AppModule {}
