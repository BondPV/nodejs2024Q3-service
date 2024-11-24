import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class CustomLoggerMiddleware implements NestMiddleware {
  private logger = new Logger(CustomLoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, query, body } = req;
    const sanitizedBody = this.sanitizeBody(body);

    res.on('finish', () => {
      const { statusCode } = res;
      this.logger.log(
        `${method} ${originalUrl} ${statusCode} Query: ${JSON.stringify(
          query,
        )}, Body: ${JSON.stringify(sanitizedBody)}`,
      );
    });

    next();
  }

  private sanitizeBody(body: unknown): unknown {
    if (typeof body === 'object' && body !== null) {
      const sanitized = { ...body };

      for (const key in sanitized) {
        if (sanitized.hasOwnProperty(key)) {
          if (key.toLowerCase() === 'password') {
            sanitized[key] = '*****';
          } else if (typeof sanitized[key] === 'object') {
            sanitized[key] = this.sanitizeBody(sanitized[key]);
          }
        }
      }

      return sanitized;
    }

    return body;
  }
}
