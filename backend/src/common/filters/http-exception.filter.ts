import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Response } from 'express';
import { AppLoggerService } from '../logger/logger.service';

@Injectable()
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: AppLoggerService) {
    this.logger.setContext('HttpExceptionFilter');
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || exception.message;
    } else if (exception.name === 'ValidationError') {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
    } else if (exception.code === 11000) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Duplicate entry found';
    } else if (exception.name === 'JsonWebTokenError') {
      status = HttpStatus.UNAUTHORIZED;
      message = 'Invalid token';
    } else if (exception.message) {
      message = exception.message;
    }

    // Log error with appropriate level
    const errorDetails = {
      statusCode: status,
      path: request.url,
      method: request.method,
      message,
      stack: exception.stack,
    };

    if (status >= 500) {
      this.logger.error(
        `HTTP ${status} Error: ${message}`,
        exception.stack,
        'HttpExceptionFilter',
      );
    } else {
      this.logger.warn(
        `HTTP ${status} Error: ${message} - ${request.method} ${request.url}`,
        'HttpExceptionFilter',
      );
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: message,
    });
  }
}

