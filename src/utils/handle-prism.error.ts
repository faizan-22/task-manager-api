import {
  ConflictException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

export function handlePrismaError(error: unknown): never {
  if (error instanceof HttpException) {
    throw error;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        throw new ConflictException('Unique constraint failed');

      case 'P2025':
        throw new NotFoundException('Record not found');

      default:
        throw new InternalServerErrorException('Database error');
    }
  }

  const message = error instanceof Error ? error.message : `${error}`;

  throw new InternalServerErrorException(message);
}
