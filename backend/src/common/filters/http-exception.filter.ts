import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = isHttpException ? exception.getResponse() : null;
    const message = isHttpException
      ? (typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any)?.message) || exception.message
      : 'Internal server error';

    if (!isHttpException) {
      this.logger.error(
        `${request.method} ${request.url} -> ${(exception as Error)?.message}`,
        (exception as Error)?.stack,
      );
    } else if (status >= 500) {
      this.logger.error(`${request.method} ${request.url} -> ${message}`);
    } else {
      this.logger.warn(`${request.method} ${request.url} -> ${message}`);
    }

    response.status(status).json({
      statusCode: status,
      path: request.url,
      timestamp: new Date().toISOString(),
      message,
    });
  }
}
