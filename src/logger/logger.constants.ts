export const LOG_LEVELS = {
  log: 'log',
  error: 'error',
  warn: 'warn',
  debug: 'debug',
  verbose: 'verbose',
} as const;

export const LOG_FILES = {
  dirPath: 'logs',
  logFile: 'logs.log',
  errLogFile: 'errors.log',
} as const;
