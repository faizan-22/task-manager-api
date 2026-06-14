/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ValidationPipe,
  ParseIntPipe,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiOAuth2 } from '@nestjs/swagger';
import { PaginationDto } from './dto/pagination.dto';
import { LoggingInterceptor } from 'src/utils/logging.interceptor';
import { CacheService } from 'src/cache/cache.service';

@UseGuards(JwtAuthGuard)
@UseInterceptors(LoggingInterceptor)
@ApiOAuth2([], 'oauth2-login')
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly cacheService: CacheService,
  ) {}

  @Post()
  create(
    @Request() req,
    @Body(new ValidationPipe({ transform: true })) createTaskDto: CreateTaskDto,
  ) {
    const payload = req.payload;
    const finalTask = {
      ...createTaskDto,
      user: {
        connect: { id: parseInt(payload.sub) },
      },
    };
    return this.tasksService.create(finalTask);
  }

  @Get()
  async findAll(
    @Request() req,
    @Query(new ValidationPipe({ transform: true })) pagination: PaginationDto,
  ) {
    const cacheKey: string = `${req.originalUrl}:${req.payload.sub}:page=${pagination.page}:limit=${pagination.limit}`;
    let data = await this.cacheService.get(cacheKey);
    if (data == null || data == undefined) {
      console.log('Cache miss!!');
      const userId = parseInt(req.payload.sub);
      data = await this.tasksService.findAll(userId, pagination);
      await this.cacheService.set(cacheKey, data, 60000);
    }
    return data;
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const cacheKey: string = `${req.originalUrl}:${req.payload.sub}`;
    const payload = req.payload;
    let data = await this.cacheService.get(cacheKey);
    if (data == null || data == undefined) {
      console.log('Cache Miss');
      data = await this.tasksService.findOne(id, parseInt(payload.sub));
      await this.cacheService.set(cacheKey, data, 60000);
    }
    return data;
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateTaskDto: UpdateTaskDto,
  ) {
    const payload = req.payload;
    const finalUpdateTask = {
      ...updateTaskDto,
      user: {
        connect: { id: parseInt(payload.sub) },
      },
    };
    return this.tasksService.update(id, parseInt(payload.sub), finalUpdateTask);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const payload = req.payload;
    return this.tasksService.remove(id, parseInt(payload.sub));
  }
}
