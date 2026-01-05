/**
 * Session ID management
 * Uses browser sessionStorage for client-side, generates new ID per session
 */

const SESSION_ID_KEY = 'at_session_id';
const SESSION_START_KEY = 'at_session_start';

/**
 * Get or create session ID
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') {
    // Server-side: generate new ID (shouldn't happen in practice)
    return generateSessionId();
  }

  // Check if session ID exists in sessionStorage
  let sessionId = sessionStorage.getItem(SESSION_ID_KEY);
  
  if (!sessionId) {
    // Generate new session ID
    sessionId = generateSessionId();
    sessionStorage.setItem(SESSION_ID_KEY, sessionId);
    sessionStorage.setItem(SESSION_START_KEY, Date.now().toString());
  }

  return sessionId;
}

/**
 * Generate a new session ID
 */
function generateSessionId(): string {
  // Format: timestamp-randomstring
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${random}`;
}

/**
 * Get session start timestamp
 */
export function getSessionStart(): number {
  if (typeof window === 'undefined') {
    return Date.now();
  }

  const start = sessionStorage.getItem(SESSION_START_KEY);
  return start ? parseInt(start, 10) : Date.now();
}

/**
 * Check if user is new or returning
 */
export function getUserType(): 'new' | 'returning' {
  if (typeof window === 'undefined') {
    return 'new';
  }

  // Check if there's a previous session in localStorage
  const lastSession = localStorage.getItem('at_last_session');
  const currentSession = getSessionId();

  if (!lastSession || lastSession !== currentSession) {
    // Store current session for next time
    localStorage.setItem('at_last_session', currentSession);
    return 'new';
  }

  return 'returning';
}

/**
 * Detect device type
 */
export function getDeviceType(): 'ios' | 'android' | 'desktop' {
  if (typeof window === 'undefined') {
    return 'desktop';
  }

  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

  if (/android/i.test(userAgent)) {
    return 'android';
  }

  if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
    return 'ios';
  }

  return 'desktop';
}

