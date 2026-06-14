/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { Request } from 'express';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();

    // 👇 Check if the path includes or matches your target route
    if (request?.url?.includes('auth/swagger-login')) {
      return next.handle(); // 🚀 Skip the transformation
    }
    return next.handle().pipe(
      map((dataFromController) => {
        return {
          success: true,
          data: dataFromController,
        };
      }),
    );
  }
}
