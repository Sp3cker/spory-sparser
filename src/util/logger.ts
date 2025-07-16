import { writeFileSync, appendFileSync, mkdirSync, existsSync } from 'fs';
import { dirname } from 'path';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private logFile: string;

  constructor(logFile: string = 'log/output.log') {
    this.logFile = logFile;
    this.ensureLogDirectory();
  }

  private ensureLogDirectory(): void {
    const logDir = dirname(this.logFile);
    if (!existsSync(logDir)) {
      mkdirSync(logDir, { recursive: true });
    }
  }

  private formatMessage(level: LogLevel, message: string, ...args: any[]): string {
    const timestamp = new Date().toISOString();
    const formattedArgs = args.length > 0 ? ' ' + args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
    ).join(' ') : '';
    
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${formattedArgs}\n`;
  }

  private log(level: LogLevel, message: string, ...args: any[]): void {
    const formattedMessage = this.formatMessage(level, message, ...args);
    
    // Write to file
    try {
      appendFileSync(this.logFile, formattedMessage);
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
    
    // Also output to console
    // console.log(formattedMessage.trim());
  }

  info(message: string, ...args: any[]): void {
    this.log('info', message, ...args);
  }

  warn(message: string, ...args: any[]): void {
    this.log('warn', message, ...args);
  }

  error(message: string, ...args: any[]): void {
    this.log('error', message, ...args);
  }

  debug(message: string, ...args: any[]): void {
    this.log('debug', message, ...args);
  }

  clearLog(): void {
    try {
      writeFileSync(this.logFile, '');
    } catch (error) {
      console.error('Failed to clear log file:', error);
    }
  }
}

// Export a singleton instance
export const logger = new Logger();
export { Logger };
