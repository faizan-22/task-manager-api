import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  logger = new Logger(RequestLoggerMiddleware.name);
  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(`${req.method} ${req.baseUrl}`);
    next();
  }
}
