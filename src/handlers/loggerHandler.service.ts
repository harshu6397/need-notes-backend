import { Injectable, Logger as NestLogger } from '@nestjs/common';
import * as winston from 'winston';
import * as stackTrace from 'stack-trace';

@Injectable()
export class LoggerService extends NestLogger {
  private logger: winston.Logger;

  constructor() {
    super();
    this.logger = winston.createLogger({
      transports: [new winston.transports.Console()],
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ level, message, timestamp, context }) => {
          const formattedTimestamp = timestamp.slice(0, 19);
          return `[${level}] [${formattedTimestamp}] ${message}: ${context ? ` ${context}` : ''}`;
        }),
      ),
    });
  }

  private getFunctionName() {
    const trace = stackTrace.get()[2];
    const parts = trace.getFileName().split('/');
    const filename = parts[parts.length - 1];
    const functionName = trace.getFunctionName() || 'anonymous';
    return `${filename}:${functionName}`;
  }

  log(message: any, context?: any) {
    const functionName = this.getFunctionName();
    this.logger.info(`[${functionName}] ${message}`, { context });
  }

  error(message: any, trace?: any, context?: any) {
    const functionName = this.getFunctionName();
    this.logger.error(`[${functionName}] ${message}`, { context, trace });
  }

  warn(message: any, context?: any) {
    const functionName = this.getFunctionName();
    this.logger.warn(`[${functionName}] ${message}`, { context });
  }

  debug(message: any, context?: any) {
    const functionName = this.getFunctionName();
    this.logger.debug(`[${functionName}] ${message}`, { context });
  }

  verbose(message: any, context?: any) {
    const functionName = this.getFunctionName();
    this.logger.verbose(`[${functionName}] ${message}`, { context });
  }
}
