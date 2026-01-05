/**
 * Error logging utility
 * In production, integrate with Sentry, LogRocket, or similar service
 */

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  vertical?: string;
  provider?: string;
  searchParams?: Record<string, any>;
  [key: string]: any;
}

/**
 * Log an error with context
 */
export function logError(
  error: Error | string,
  severity: ErrorSeverity = ErrorSeverity.MEDIUM,
  context?: ErrorContext
): void {
  const errorMessage = error instanceof Error ? error.message : error;
  const errorStack = error instanceof Error ? error.stack : undefined;

  const logEntry = {
    timestamp: new Date().toISOString(),
    severity,
    message: errorMessage,
    stack: errorStack,
    context: context || {},
  };

  // In development, log to console
  if (process.env.NODE_ENV === 'development') {
    console.error('[Error Logger]', logEntry);
    return;
  }

  // In production, send to error tracking service
  // Example: Sentry.captureException(error, { extra: context });
  
  // For now, log to console (replace with actual service integration)
  console.error('[Error Logger]', JSON.stringify(logEntry, null, 2));

  // TODO: Integrate with error tracking service
  // if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  //   Sentry.captureException(error, {
  //     level: severity,
  //     extra: context,
  //   });
  // }
}

/**
 * Log a provider error specifically
 */
export function logProviderError(
  provider: string,
  error: Error | string,
  context?: ErrorContext
): void {
  logError(error, ErrorSeverity.MEDIUM, {
    ...context,
    provider,
    errorType: 'provider_error',
  });
}

/**
 * Log an API error
 */
export function logApiError(
  endpoint: string,
  error: Error | string,
  context?: ErrorContext
): void {
  logError(error, ErrorSeverity.HIGH, {
    ...context,
    endpoint,
    errorType: 'api_error',
  });
}

/**
 * Log a critical error
 */
export function logCriticalError(
  error: Error | string,
  context?: ErrorContext
): void {
  logError(error, ErrorSeverity.CRITICAL, {
    ...context,
    errorType: 'critical_error',
  });
}

