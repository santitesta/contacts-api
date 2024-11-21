import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    // Handle HTTP Exceptions
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseMessage = exception.getResponse();
      message =
        typeof responseMessage === 'string'
          ? responseMessage
          : responseMessage['message'];
    }
    // Handle TypeORM Query Errors
    else if (exception instanceof QueryFailedError) {
      status = HttpStatus.BAD_REQUEST; // Adjust as needed
      message = this.handleDatabaseError(exception);
    }
    // Handle Other Exceptions
    else {
      this.logger.error('Unexpected error:', exception);
    }

    this.logger.error(`[${status}] ${message} - ${request.method}`);

    response.status(status).json({
      statusCode: status,
      message,
    });
  }

  private handleDatabaseError(exception: QueryFailedError): string {
    const dbErrorCode = (exception as any).code;
    const detail = (exception as any).detail || '';

    switch (dbErrorCode) {
      case '23505': // Unique constraint violation
        return this.extractFieldFromDetail(
          detail,
          'Duplicate entry detected for',
        );
      case '23503': // Foreign key violation
        return this.extractFieldFromDetail(detail, 'Invalid reference for');
      default:
        return 'Database query error.';
    }
  }

  private extractFieldFromDetail(detail: string, baseMessage: string): string {
    const match = detail.match(/\(([^)]+)\)/); // Regex to find `(field_name)`
    const field = match ? match[1] : 'unknown field';
    return `${baseMessage} "${field}".`;
  }
}
