import 'dotenv/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConsoleLogger } from '@nestjs/common';
import { ResponseTransformInterceptor } from './utils/response-transform.interceptor';
import { AllExceptionsFilter } from './utils/all-exception.filter';

async function bootstrap() {
  if (!process.env.SECRET) {
    throw new Error('SECRET is required');
  }

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required');
  }

  if (!process.env.REDIS_DB) {
    throw new Error('REDIS_DB is required');
  }

  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      prefix: 'TaskApp',
      colors: true,
      compact: false,
      timestamp: true,
    }),
  });

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  app.useGlobalInterceptors(new ResponseTransformInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Tasks Manager')
    .setDescription('The tasks API Description')
    .setVersion('1.0')
    .addOAuth2(
      {
        type: 'oauth2',
        flows: {
          password: {
            tokenUrl: '/auth/swagger-login',
            scopes: {},
          },
        },
      },
      'oauth2-login',
    )
    .addTag('TASK MANAGER')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
}

bootstrap();
