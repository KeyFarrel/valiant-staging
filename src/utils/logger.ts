/**
 * Secure Logging Utility
 * 
 * This utility provides environment-aware logging functionality:
 * - In development: All logs are displayed normally
 * - In production/staging: Logs are suppressed
 * 
 * Usage:
 * import { logger } from '@/utils/logger';
 * 
 * logger.info('This is an info message');
 * logger.warn('This is a warning');
 * logger.error('This is an error');
 * logger.debug('This is debug info');
 */

import { getEnvironment, isProduction, isStaging, isDevelopment } from './secureEnv';

// Type definitions for logger methods
type LogMethod = (...args: any[]) => void;
type LoggerInterface = {
  log: LogMethod;
  info: LogMethod;
  warn: LogMethod;
  error: LogMethod;
  debug: LogMethod;
  trace: LogMethod;
  table: LogMethod;
  group: LogMethod;
  groupEnd: LogMethod;
  time: LogMethod;
  timeEnd: LogMethod;
  count: LogMethod;
  assert: LogMethod;
  clear: LogMethod;
};

/**
 * Creates a no-operation function for production environments
 */
const noop = (): void => {};

/**
 * Creates a logger that only outputs in development mode
 */
const createEnvironmentAwareLogger = (): LoggerInterface => {
  // Check current environment
  const environment = getEnvironment();
  const isDevMode = isDevelopment();
  
  // In production/staging, return no-op functions
  if (!isDevMode) {
    return {
      log: noop,
      info: noop,
      warn: noop,
      error: noop,
      debug: noop,
      trace: noop,
      table: noop,
      group: noop,
      groupEnd: noop,
      time: noop,
      timeEnd: noop,
      count: noop,
      assert: noop,
      clear: noop
    };
  }
  
  // In development, return console methods with prefixes
  return {
    log: (...args: any[]) => console.log('[LOG]', ...args),
    info: (...args: any[]) => console.info('[INFO]', ...args),
    warn: (...args: any[]) => console.warn('[WARN]', ...args),
    error: (...args: any[]) => console.error('[ERROR]', ...args),
    debug: (...args: any[]) => console.debug('[DEBUG]', ...args),
    trace: (...args: any[]) => console.trace('[TRACE]', ...args),
    table: (tabularData: any, properties?: string[]) => console.table(tabularData, properties),
    group: (...args: any[]) => console.group('[GROUP]', ...args),
    groupEnd: () => console.groupEnd(),
    time: (label: string) => console.time(label),
    timeEnd: (label: string) => console.timeEnd(label),
    count: (label: string) => console.count(label),
    assert: (condition: boolean, ...args: any[]) => console.assert(condition, ...args),
    clear: () => console.clear()
  };
};

// Export the environment-aware logger
export const logger = createEnvironmentAwareLogger();

/**
 * Override the global console object to prevent accidental logging in production
 * Only applies in production/staging environments
 */
export const setupGlobalLoggerOverride = (): void => {
  if (isProduction() || isStaging()) {
    // Store original methods for potential restoration
    const originalConsole = { ...console };
    
    // Override console methods to be no-ops in production/staging
    console.log = noop;
    console.info = noop;
    console.warn = noop;
    console.debug = noop;
    console.trace = noop;
    console.table = noop;
    console.group = noop;
    console.groupEnd = noop;
    console.time = noop;
    console.timeEnd = noop;
    console.count = noop;
    
    // Keep error for critical issues, but strip sensitive data
    console.error = (...args: any[]) => {
      // Only log generic error message without details in production
      originalConsole.error('[ERROR] An error occurred');
    };
    
    // Allow assert for critical checks, but without details
    console.assert = (condition: boolean, ...args: any[]) => {
      if (!condition) {
        originalConsole.error('[ASSERT] Assertion failed');
      }
    };
  }
};
