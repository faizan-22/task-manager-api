import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import {
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { Request, Response } from 'express';

type myResponseObj = {
  message: string | object;
  statusCode: number;
  url: string;
  timestamp: string;
};

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const myRespose: myResponseObj = {
      message: '',
      statusCode: 500,
      url: request.url,
      timestamp: new Date().toLocaleString(),
    };

    if (exception instanceof HttpException) {
      myRespose.statusCode = exception.getStatus();
      myRespose.message = exception.message;
    } else if (exception instanceof PrismaClientValidationError) {
      myRespose.statusCode = 422;
      myRespose.message = exception.message.replaceAll(/\n/g, ' ');
    } else if (exception instanceof PrismaClientUnknownRequestError) {
      myRespose.statusCode = 423;
      myRespose.message = exception.message.replaceAll(/\n/g, ' ');
    } else {
      myRespose.message = 'Internal Server Error';
    }

    response.status(myRespose.statusCode).json(myRespose);

    super.catch(exception, host);
  }
}
