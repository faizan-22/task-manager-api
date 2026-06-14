import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  imports: [DatabaseModule, AuthModule, UsersModule, CacheModule],
})
export class TasksModule {}
