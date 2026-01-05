/**
 * Generate a UUID v4 click ID
 * For client-side, uses crypto.randomUUID() if available, otherwise falls back to a simple implementation
 */
export function generateClickId(): string {
  if (typeof window !== 'undefined') {
    // Browser environment
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    // Fallback for older browsers
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  } else {
    // Server environment - use Node.js crypto
    try {
      const { randomUUID } = require('crypto');
      return randomUUID();
    } catch {
      // Fallback if crypto is not available
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }
  }
}

/**
 * Validate UUID v4 format
 */
export function isValidClickId(clickId: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(clickId);
}

