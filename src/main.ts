import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';
import { load } from 'js-yaml';
import { CustomLoggerService } from './logger/logger.service';

dotenv.config();
const port = process.env.PORT || 4000;
const swaggerDoc = process.env.SWAGGER_DOC || 'file';

const addLogListeners = (logger: CustomLoggerService): void => {
  process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception:', error.stack);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason) => {
    logger.error(
      'Unhandled Rejection:',
      reason instanceof Error ? reason.stack : String(reason),
    );
    process.exit(1);
  });
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  const logger = app.get(CustomLoggerService);
  app.useLogger(logger);
  addLogListeners(logger);

  if (swaggerDoc === 'file') {
    const file = await readFile(
      join(__dirname, '..', 'doc', 'api.yaml'),
      'utf8',
    );
    const document = load(file) as OpenAPIObject;
    SwaggerModule.setup('doc', app, document);
  } else if (swaggerDoc === 'auto') {
    const config = new DocumentBuilder()
      .setTitle('Home Library Service')
      .setDescription('Home music library service')
      .setVersion('1.0.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('doc', app, document);
  }

  await app.listen(port);
  console.log(`Server is running on http://localhost:${port}/`);
  console.log(`OpenAPI: http://localhost:${port}/doc`);
}

bootstrap().catch((error) => {
  const logger = new CustomLoggerService();
  logger.error('Error during application bootstrap', error.stack);
});
