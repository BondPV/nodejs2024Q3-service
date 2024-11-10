import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';
import { load } from 'js-yaml';

dotenv.config();
const port = process.env.PORT || 4000;
const swaggerDoc = process.env.SWAGGER_DOC || 'file';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

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
}

bootstrap();
