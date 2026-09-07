import {
  Catch,
  HttpException,
  HttpStatus,
  Logger,
  type ExceptionFilter,
  type ArgumentsHost,
} from '@nestjs/common';
import type { Response, Request } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    let message = 'Internal server error';
    let code = 'INTERNAL_ERROR';
    let details: Record<string, unknown> | undefined = undefined;

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const respObj = exceptionResponse as Record<string, unknown>;
      message = (respObj.message as string) || message;
      code = (respObj.error as string) || `HTTP_${status}`;
      details = respObj;
    }

    // Never leak stack traces or internal errors to client
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(`Unhandled Exception at ${request.url}`, exception);
      message = 'An unexpected error occurred. Please contact the administrator.';
      code = 'INTERNAL_SERVER_ERROR';
      details = undefined;
    }

    response.status(status).json({
      error: {
        code,
        message,
        statusCode: status,
        details,
      },
      meta: {
        timestamp: new Date().toISOString(),
        path: request.url,
      },
    });
  }
}
