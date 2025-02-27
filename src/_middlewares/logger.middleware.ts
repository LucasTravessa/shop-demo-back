import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);

  injectLogging(request: Request, response: Response): void {
    const { method, originalUrl: url, body } = request;

    const requestStart = Date.now();
    const requestId = crypto.randomUUID();

    this.logger.verbose({
      message: `${requestId} Request to ${method} ${url}`,
      data: body,
    });

    response.setHeader('X-Request-Id', requestId);
    response.on('finish', () => {
      const { statusCode } = response;
      const processingTime = Date.now() - requestStart;
      const logLevel = statusCode === 404 ? 'verbose' : 'log';
      this.logger[logLevel](
        `${requestId} ${statusCode} response to ${method} ${url} in ${processingTime}ms`,
      );
    });
  }

  use(req: Request, res: Response, next: NextFunction): void {
    this.injectLogging(req, res);
    next();
  }
}
