import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { handlePrismaError } from 'src/utils/handle-prism.error';

const taskSelect = {
  id: true,
  title: true,
  description: true,
  status: true,
  createdAt: true,
  updatedAt: true,
};

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createTaskDto: Prisma.TaskCreateInput) {
    try {
      const task = this.databaseService.task.create({
        data: createTaskDto,
        select: taskSelect,
      });
      this.logger.log('Task created');
      return task;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async findAll(
    userId: number,
    { page, limit }: { page: number; limit: number },
  ) {
    try {
      const skip = (page - 1) * limit;
      const take = limit;
      return await this.databaseService.task.findMany({
        where: {
          userId: userId,
        },
        skip: skip,
        take: take,
        orderBy: {
          createdAt: 'desc',
        },
        select: taskSelect,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async findOne(id: number, userId: number) {
    try {
      const task = await this.databaseService.task.findUnique({
        where: {
          id: id,
        },
        select: { ...taskSelect, userId: true },
      });

      if (!task) throw new NotFoundException('Task Not Found');

      if (task.userId != userId) {
        throw new ForbiddenException('You cannot access this task');
      }

      const { userId: _userId, ...taskWithoutUserId } = task;
      void _userId;
      return taskWithoutUserId;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async update(
    id: number,
    userId: number,
    updateTaskDto: Prisma.TaskUpdateInput,
  ) {
    try {
      const task = await this.databaseService.task.findUnique({
        where: {
          id: id,
        },
        select: { ...taskSelect, userId: true },
      });

      if (!task) throw new NotFoundException('Task Not Found');

      if (task.userId != userId) {
        throw new ForbiddenException('You cannot access this task');
      }

      const updatedTask = this.databaseService.task.update({
        where: {
          id: id,
        },
        data: updateTaskDto,
        select: taskSelect,
      });

      this.logger.log('Task Updated');
      return updatedTask;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async remove(id: number, userId: number) {
    try {
      const task = await this.databaseService.task.findUnique({
        where: {
          id: id,
        },
      });

      if (!task) throw new NotFoundException('Task Not Found');

      if (task.userId != userId) {
        throw new ForbiddenException('You cannot access this task');
      }

      const deletedTask = this.databaseService.task.delete({
        where: {
          userId: userId,
          id: id,
        },
        select: taskSelect,
      });

      this.logger.warn('Task deleted');
      return deletedTask;
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
