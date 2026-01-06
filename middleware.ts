import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Rate limiting store (in-memory)
 * For production, use Redis or a dedicated rate limiting service
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Rate limit configuration
 */
const RATE_LIMIT_CONFIG = {
  // API routes
  '/api/search': { maxRequests: 100, windowMs: 60 * 1000 }, // 100 requests per minute
  '/api/admin': { maxRequests: 200, windowMs: 60 * 1000 }, // 200 requests per minute
  '/api/tracking': { maxRequests: 1000, windowMs: 60 * 1000 }, // 1000 requests per minute
  // Default for other API routes
  default: { maxRequests: 100, windowMs: 60 * 1000 },
};

/**
 * Get client identifier (IP address)
 */
function getClientId(request: NextRequest): string {
  // Try to get real IP from headers (when behind proxy)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIp || 'unknown';
  return ip;
}

/**
 * Check if request should be rate limited
 */
function checkRateLimit(
  pathname: string,
  clientId: string
): { allowed: boolean; remaining: number; resetTime: number } {
  // Find matching rate limit config
  const config = Object.entries(RATE_LIMIT_CONFIG).find(([path]) =>
    pathname.startsWith(path)
  )?.[1] || RATE_LIMIT_CONFIG.default;

  const now = Date.now();
  const key = `${pathname}:${clientId}`;
  const record = rateLimitStore.get(key);

  // Clean up expired records
  if (record && now > record.resetTime) {
    rateLimitStore.delete(key);
  }

  // Check or create rate limit record
  if (!record || now > record.resetTime) {
    // New window
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: now + config.windowMs,
    };
  }

  // Increment count
  record.count += 1;

  if (record.count > config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  return {
    allowed: true,
    remaining: config.maxRequests - record.count,
    resetTime: record.resetTime,
  };
}

/**
 * Clean up old rate limit records periodically
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60 * 1000); // Clean up every minute

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply rate limiting to API routes
  if (!pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Skip rate limiting for health checks
  if (pathname === '/api/health') {
    return NextResponse.next();
  }

  const clientId = getClientId(request);
  const rateLimit = checkRateLimit(pathname, clientId);

  if (!rateLimit.allowed) {
    const response = NextResponse.json(
      {
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000),
      },
      { status: 429 }
    );

    // Add rate limit headers
    response.headers.set('X-RateLimit-Limit', '100');
    response.headers.set('X-RateLimit-Remaining', '0');
    response.headers.set('X-RateLimit-Reset', rateLimit.resetTime.toString());
    response.headers.set('Retry-After', Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString());

    return response;
  }

  // Add rate limit headers to successful requests
  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', '100');
  response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
  response.headers.set('X-RateLimit-Reset', rateLimit.resetTime.toString());

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
