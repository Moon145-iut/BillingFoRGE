export class Logger {
  static log(message: string, context?: string) {
    console.log(`[${new Date().toISOString()}] ${context || 'APP'}: ${message}`);
  }

  static error(message: string, error?: Error, context?: string) {
    console.error(`[${new Date().toISOString()}] ${context || 'APP'}: ${message}`, error?.stack || '');
  }

  static warn(message: string, context?: string) {
    console.warn(`[${new Date().toISOString()}] ${context || 'APP'}: ${message}`);
  }

  static debug(message: string, context?: string) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[${new Date().toISOString()}] ${context || 'APP'}: ${message}`);
    }
  }
}
