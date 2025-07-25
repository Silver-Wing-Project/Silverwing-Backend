import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request, Response } from 'express';
import { formatDateToString } from '@date-parser/date-parser.utils';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? typeof exception.getResponse() === 'string'
          ? exception.getResponse()
          : (exception.getResponse() as any).message || exception.message
        : 'Internal server error';

    const responseBody = {
      statusCode: status,
      timestamp: formatDateToString(new Date()),
      path: request.url,
      message,
    };

    this.logger.error(`Exception: ${message}, stack: ${exception.stack}`, exception.stack);

    httpAdapter.reply(response, responseBody, status);
  }
}
