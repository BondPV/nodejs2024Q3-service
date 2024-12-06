import { ConsoleLogger, Injectable } from '@nestjs/common';
import { resolve } from 'path';
import { existsSync } from 'fs';
import { writeFile, mkdir, stat } from 'fs/promises';
import { LOG_FILES, LOG_LEVELS } from './logger.constants';

@Injectable()
export class CustomLoggerService extends ConsoleLogger {
  private level: number;
  private maxSize: number;

  constructor() {
    super();
    this.level = +process.env.LOG_LEVEL || 2;
    this.maxSize = +process.env.MAX_LOG_SIZE || 1024;
  }

  log(message: string, context: string) {
    if (this.level >= 2)
      this.writeToLog(LOG_LEVELS.log, `${message}`, context || this.context);
  }

  error(message: string, trace: string, context?: string) {
    if (this.level >= 0)
      this.writeToLog(
        LOG_LEVELS.error,
        `${message}\n${trace}`,
        context || this.context,
      );
  }

  warn(message: string, context: string) {
    if (this.level >= 1)
      this.writeToLog(LOG_LEVELS.warn, `${message}`, context || this.context);
  }

  debug(message: string, context: string) {
    if (this.level >= 4)
      this.writeToLog(LOG_LEVELS.debug, `${message}`, context || this.context);
  }

  verbose(message: string, context: string) {
    if (this.level >= 3)
      this.writeToLog(
        LOG_LEVELS.verbose,
        `${message}`,
        context || this.context,
      );
  }

  private async writeToLog(level: string, message: string, context: string) {
    const logMessage = `[${this.getTimestamp()}] [${level.toUpperCase()}] - [${
      context || ''
    }] - [${message}]\n`;

    super[level](logMessage);

    let count = 1;
    let errorCount = 1;

    level === LOG_LEVELS.error
      ? (errorCount = await this.writeToFile(
          errorCount,
          logMessage,
          LOG_FILES.errLogFile,
        ))
      : (count = await this.writeToFile(count, logMessage, LOG_FILES.logFile));
  }

  private async writeToFile(count: number, message: string, file: string) {
    if (!existsSync(LOG_FILES.dirPath)) {
      await mkdir(LOG_FILES.dirPath);
    }

    let filePath = resolve(LOG_FILES.dirPath, `${count}.${file}`);

    if (!existsSync(filePath)) {
      await writeFile(filePath, '');
    }

    const { size } = await stat(filePath);

    if (size / 1024 > this.maxSize) {
      count++;
    }

    filePath = resolve(LOG_FILES.dirPath, `${count}.${file}`);

    await writeFile(filePath, message, { flag: 'a' });

    return count;
  }
}
