/**
 * Input sanitization utilities
 * Prevents XSS attacks and validates user input
 */

/**
 * Sanitize a string to prevent XSS attacks
 * Removes HTML tags and dangerous characters
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers (onclick=, onerror=, etc.)
    .trim();
}

/**
 * Sanitize an object recursively
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = { ...obj };

  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeString(sanitized[key]) as any;
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeObject(sanitized[key]) as any;
    }
  }

  return sanitized;
}

/**
 * Validate and sanitize search parameters
 */
export function sanitizeSearchParams(params: {
  destination?: string;
  origin?: string;
  startDate?: string;
  endDate?: string;
  [key: string]: any;
}): typeof params {
  const sanitized: typeof params = {};

  if (params.destination) {
    sanitized.destination = sanitizeString(params.destination);
  }
  if (params.origin) {
    sanitized.origin = sanitizeString(params.origin);
  }
  if (params.startDate) {
    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (dateRegex.test(params.startDate)) {
      sanitized.startDate = params.startDate;
    }
  }
  if (params.endDate) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (dateRegex.test(params.endDate)) {
      sanitized.endDate = params.endDate;
    }
  }

  // Copy other numeric/boolean fields as-is (they're already validated by type)
  Object.keys(params).forEach(key => {
    if (!['destination', 'origin', 'startDate', 'endDate'].includes(key)) {
      const value = params[key];
      if (typeof value === 'number' || typeof value === 'boolean' || value === null || value === undefined) {
        sanitized[key] = value;
      } else if (typeof value === 'string') {
        sanitized[key] = sanitizeString(value);
      }
    }
  });

  return sanitized;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Escape HTML entities
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

