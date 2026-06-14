import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import bcrypt from 'bcrypt';
import { handlePrismaError } from 'src/utils/handle-prism.error';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user: Prisma.UserCreateInput = {
        email: createUserDto.email,
        name: createUserDto.name,
        password: createUserDto.password,
      };
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(user.password, saltRounds);

      const hashedUser = { ...user, password: hashedPassword };

      const newUser = await this.databaseService.user.create({
        data: hashedUser,
      });

      if (newUser) {
        this.logger.log('User signup successful');
        return `User ${newUser.name} created successfully!`;
      }
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async findOne(id: number) {
    return this.databaseService.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  async findByEmail(email: string) {
    return this.databaseService.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  async delete(userId: number) {
    try {
      const user = await this.databaseService.user.delete({
        where: {
          id: userId,
        },
      });

      return `User ${user.name} deleted successfully!`;
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
