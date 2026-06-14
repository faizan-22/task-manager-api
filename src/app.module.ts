import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { RequestLoggerMiddleware } from './utils/request-logger.middleware';
import { HealthModule } from './health/health.module';
import { CacheModule } from './cache/cache.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    DatabaseModule,
    AuthModule,
    UsersModule,
    TasksModule,
    HealthModule,
    CacheModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
