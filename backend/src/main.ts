import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import IORedis from 'ioredis';
import session from 'express-session';
import { ms, StringValue } from './libs/common/utils/ms.util';
import { parseBoolean } from './libs/common/utils/parse-boolean.util';
import { RedisStore } from 'connect-redis';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const redis = new IORedis(config.getOrThrow('REDIS_URI'));

  app.setGlobalPrefix('api');
  app.use(
    cookieParser(config.getOrThrow<string>('COOKIES_SECRET') || 'secret'),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const sessionMaxAgeMs = ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE'));
  const sessionTtlSeconds = Math.floor(sessionMaxAgeMs / 1000);

  const redisStoreClient = {
    get: async (key: string) => {
      return await redis.get(key);
    },
    set: async (key: string, value: string, options?: { ttl?: number }) => {
      if (options?.ttl) {
        await redis.set(key, value, 'EX', options.ttl);
      } else {
        await redis.set(key, value);
      }
    },
    del: async (key: string) => {
      await redis.del(key);
    },
    expire: async (key: string, ttl: number) => {
      await redis.expire(key, ttl);
    },
  };

  app.use(
    session({
      secret: config.getOrThrow<string>('SESSION_SECRET'),
      name: config.getOrThrow<string>('SESSION_NAME'),
      resave: true,
      saveUninitialized: false,
      cookie: {
        domain: config.getOrThrow<string>('SESSION_DOMAIN'),
        maxAge: sessionMaxAgeMs,
        httpOnly: parseBoolean(config.getOrThrow<string>('SESSION_HTTP_ONLY')),
        secure: parseBoolean(config.getOrThrow<string>('SESSION_SECURE')),
        sameSite: 'lax',
      },
      store: new RedisStore({
        client: redisStoreClient as any,
        prefix: config.getOrThrow<string>('SESSION_FOLDER'),
        ttl: sessionTtlSeconds,
      }),
    }),
  );

  app.enableCors({
    origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
    credentials: true,
    exposedHeaders: ['set-cookie'],
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Cloud Box Api')
    .setDescription('Cloud Box Api description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Введите валидный Access Token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(config.getOrThrow<number>('APPLICATION_PORT'));
}
bootstrap();
