/**
 * Currency conversion utilities
 * Handles currency conversion with caching and fallback rates
 */

export type Currency = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'JPY' | 'CNY';

/**
 * Exchange rate cache
 * In production, use Redis or a database
 */
interface ExchangeRateCache {
  rates: Record<string, number>;
  timestamp: number;
  ttl: number; // Time to live in milliseconds (default: 1 hour)
}

let rateCache: ExchangeRateCache | null = null;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

/**
 * Fallback exchange rates (updated periodically)
 * These are used when the API is unavailable
 */
const FALLBACK_RATES: Record<string, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  CAD: 1.35,
  AUD: 1.52,
  JPY: 149.50,
  CNY: 7.24,
};


/**
 * Get exchange rate from cache or API
 */
export async function getExchangeRate(from: Currency, to: Currency): Promise<number> {
  // Same currency, no conversion needed
  if (from === to) {
    return 1.0;
  }

  // Check cache
  if (rateCache && Date.now() - rateCache.timestamp < rateCache.ttl) {
    const cacheKey = `${from}_${to}`;
    if (rateCache.rates[cacheKey]) {
      return rateCache.rates[cacheKey];
    }
  }

  // Try to fetch from API
  try {
    const rate = await fetchExchangeRate(from, to);
    
    // Update cache
    if (!rateCache) {
      rateCache = {
        rates: {},
        timestamp: Date.now(),
        ttl: CACHE_TTL,
      };
    }
    
    rateCache.rates[`${from}_${to}`] = rate;
    rateCache.rates[`${to}_${from}`] = 1 / rate; // Cache reverse rate
    rateCache.timestamp = Date.now();
    
    return rate;
  } catch (error) {
    console.warn('Failed to fetch exchange rate, using fallback:', error);
    
    // Use fallback rates
    const fromRate = FALLBACK_RATES[from] || 1.0;
    const toRate = FALLBACK_RATES[to] || 1.0;
    return toRate / fromRate;
  }
}

/**
 * Fetch exchange rate from API
 * Uses ExchangeRate-API (free tier: 1,500 requests/month)
 * Alternative: exchangerate-api.com, fixer.io, etc.
 */
async function fetchExchangeRate(from: Currency, to: Currency): Promise<number> {
  // Option 1: ExchangeRate-API (free, no API key needed for basic usage)
  // const apiUrl = `https://api.exchangerate-api.com/v4/latest/${from}`;
  
  // Option 2: exchangerate-api.com (requires API key)
  const apiKey = process.env.EXCHANGE_RATE_API_KEY;
  if (apiKey) {
    const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${from}/${to}`;
    
    const response = await fetch(apiUrl, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error(`Exchange rate API error: ${response.status}`);
    }
    
    const data = await response.json();
    if (data.result === 'success' && data.conversion_rate) {
      return data.conversion_rate;
    }
    
    throw new Error('Invalid exchange rate API response');
  }
  
  // Fallback: Use ExchangeRate-API free tier (no key required)
  const apiUrl = `https://api.exchangerate-api.com/v4/latest/${from}`;
  const response = await fetch(apiUrl, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });
  
  if (!response.ok) {
    throw new Error(`Exchange rate API error: ${response.status}`);
  }
  
  const data = await response.json();
  if (data.rates && data.rates[to]) {
    return data.rates[to];
  }
  
  throw new Error('Exchange rate not found in API response');
}

/**
 * Convert amount from one currency to another
 */
export async function convertCurrency(
  amount: number,
  from: Currency,
  to: Currency
): Promise<number> {
  if (from === to) {
    return amount;
  }
  
  const rate = await getExchangeRate(from, to);
  return amount * rate;
}

/**
 * Convert amount synchronously using cached or fallback rates
 * Use this for client-side conversions when you have cached rates
 */
export function convertCurrencySync(
  amount: number,
  from: Currency,
  to: Currency,
  rate?: number
): number {
  if (from === to) {
    return amount;
  }
  
  // Use provided rate or fallback
  const conversionRate = rate || (FALLBACK_RATES[to] / FALLBACK_RATES[from]);
  return amount * conversionRate;
}

/**
 * Format currency amount with proper symbol
 */
export function formatCurrency(amount: number, currency: Currency): string {
  const symbols: Record<Currency, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'C$',
    AUD: 'A$',
    JPY: '¥',
    CNY: '¥',
  };
  
  const symbol = symbols[currency] || currency;
  
  // Format number with appropriate decimal places
  const decimals = currency === 'JPY' ? 0 : 2;
  const formatted = amount.toFixed(decimals);
  
  // Add thousand separators
  const parts = formatted.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  return `${symbol}${parts.join('.')}`;
}

/**
 * Get currency symbol
 */
export function getCurrencySymbol(currency: Currency): string {
  const symbols: Record<Currency, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'C$',
    AUD: 'A$',
    JPY: '¥',
    CNY: '¥',
  };
  
  return symbols[currency] || currency;
}

/**
 * Prefetch exchange rates for common currency pairs
 */
export async function prefetchExchangeRates(baseCurrency: Currency = 'USD'): Promise<void> {
  const commonCurrencies: Currency[] = ['EUR', 'GBP', 'CAD', 'AUD'];
  
  await Promise.all(
    commonCurrencies.map(async (currency) => {
      if (currency !== baseCurrency) {
        try {
          await getExchangeRate(baseCurrency, currency);
        } catch (error) {
          // Silently fail - fallback rates will be used
          console.warn(`Failed to prefetch rate for ${baseCurrency} to ${currency}:`, error);
        }
      }
    })
  );
}

/**
 * Clear exchange rate cache
 */
export function clearRateCache(): void {
  rateCache = null;
}

/**
 * Get cached exchange rate (synchronous)
 * Returns null if not cached
 */
export function getCachedRate(from: Currency, to: Currency): number | null {
  if (from === to) {
    return 1.0;
  }
  
  if (!rateCache || Date.now() - rateCache.timestamp >= rateCache.ttl) {
    return null;
  }
  
  const cacheKey = `${from}_${to}`;
  return rateCache.rates[cacheKey] || null;
}

