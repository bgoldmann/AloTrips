import { ProviderAdapter, ProviderResponse, CacheEntry } from './base';
import { Offer, Vertical, SearchParams } from '@/types';
import { validateOffer } from './normalizer';
import { logProviderError } from '@/lib/errors/logger';

/**
 * In-memory cache for provider responses
 * For production, consider using Redis
 */
class InMemoryCache {
  private cache: Map<string, CacheEntry> = new Map();
  private defaultTtl = 5 * 60 * 1000; // 5 minutes

  get(key: string): Offer[] | null {
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set(key: string, data: Offer[], ttl?: number): void {
    this.cache.set(key, {
      key,
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTtl,
    });
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

/**
 * Aggregator that searches across multiple providers
 */
export class ProviderAggregator {
  private providers: Map<string, ProviderAdapter> = new Map();
  private cache: InMemoryCache = new InMemoryCache();
  private defaultTimeout = 10000; // 10 seconds

  /**
   * Register a provider adapter
   */
  register(adapter: ProviderAdapter): void {
    this.providers.set(adapter.name, adapter);
  }

  /**
   * Unregister a provider adapter
   */
  unregister(name: string): void {
    this.providers.delete(name);
  }

  /**
   * Get all registered providers
   */
  getProviders(): ProviderAdapter[] {
    return Array.from(this.providers.values());
  }

  /**
   * Search across all providers that support the given vertical
   */
  async search(
    vertical: Vertical,
    searchParams: SearchParams,
    options: {
      timeout?: number;
      useCache?: boolean;
      providers?: string[]; // Filter to specific providers
    } = {}
  ): Promise<ProviderResponse[]> {
    const timeout = options.timeout || this.defaultTimeout;
    const useCache = options.useCache !== false;
    const providerFilter = options.providers;

    // Generate cache key
    const cacheKey = this.generateCacheKey(vertical, searchParams, providerFilter);

    // Check cache
    if (useCache) {
      const cached = this.cache.get(cacheKey);
      if (cached) {
        return [{
          provider: 'cache',
          data: cached,
          cached: true,
          responseTime: 0,
        }];
      }
    }

    // Get providers that support this vertical
    const relevantProviders = this.getProviders()
      .filter(p => p.supportedVerticals.includes(vertical))
      .filter(p => !providerFilter || providerFilter.includes(p.name));

    if (relevantProviders.length === 0) {
      return [];
    }

    // Search all providers in parallel with timeout and retry
    const searchPromises = relevantProviders.map(provider =>
      this.searchWithTimeout(provider, vertical, searchParams, timeout, 2)
        .catch(error => {
          // Log provider error
          logProviderError(provider.name, error, {
            vertical,
            searchParams: {
              destination: searchParams.destination,
              origin: searchParams.origin,
            },
          });
          // Return empty array on failure
          return [];
        })
    );

    const results = await Promise.allSettled(searchPromises);

    // Process results
    const responses: ProviderResponse[] = [];
    const allOffers: Offer[] = [];

    results.forEach((result, index) => {
      const provider = relevantProviders[index];
      const startTime = Date.now();

      if (result.status === 'fulfilled') {
        const offers = result.value;
        const validOffers = offers.filter(validateOffer);
        allOffers.push(...validOffers);

        responses.push({
          provider: provider.name,
          data: validOffers,
          cached: false,
          responseTime: Date.now() - startTime,
        });
      } else {
        // Provider failed - try to use cached data as fallback
        const cacheKey = this.generateCacheKey(vertical, searchParams, [provider.name]);
        const cachedData = this.cache.get(cacheKey);
        
        if (cachedData && cachedData.length > 0) {
          // Use cached data as fallback
          responses.push({
            provider: provider.name,
            data: cachedData,
            cached: true,
            responseTime: Date.now() - startTime,
            error: result.reason?.message || 'Unknown error',
            fallback: true,
          });
        } else {
          // No cache available
          responses.push({
            provider: provider.name,
            data: [],
            cached: false,
            responseTime: Date.now() - startTime,
            error: result.reason?.message || 'Unknown error',
          });
        }
      }
    });

    // Cache the aggregated results
    if (useCache && allOffers.length > 0) {
      this.cache.set(cacheKey, allOffers);
    }

    return responses;
  }

  /**
   * Search a single provider with timeout and retry logic
   */
  private async searchWithTimeout(
    provider: ProviderAdapter,
    vertical: Vertical,
    searchParams: SearchParams,
    timeout: number,
    retries: number = 2
  ): Promise<Offer[]> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await Promise.race([
          provider.search(vertical, searchParams),
          new Promise<Offer[]>((_, reject) =>
            setTimeout(() => reject(new Error(`Provider timeout after ${timeout}ms`)), timeout)
          ),
        ]);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        // Don't retry on the last attempt
        if (attempt < retries) {
          // Exponential backoff: wait 500ms, 1000ms, 2000ms
          const backoffDelay = 500 * Math.pow(2, attempt);
          await new Promise(resolve => setTimeout(resolve, backoffDelay));
          continue;
        }
      }
    }

    // All retries failed
    throw lastError || new Error('Provider search failed after retries');
  }

  /**
   * Generate cache key from search parameters
   */
  private generateCacheKey(
    vertical: Vertical,
    searchParams: SearchParams,
    providerFilter?: string[]
  ): string {
    const parts = [
      vertical,
      searchParams.origin || '',
      searchParams.destination,
      searchParams.startDate,
      searchParams.endDate,
      searchParams.travelers.toString(),
      providerFilter ? providerFilter.sort().join(',') : 'all',
    ];
    return `search:${parts.join(':')}`;
  }

  /**
   * Clear the cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number } {
    return {
      size: this.cache.size(),
    };
  }

  /**
   * Check if providers are available
   */
  async checkProviderHealth(): Promise<Record<string, boolean>> {
    const providers = this.getProviders();
    const healthChecks = await Promise.allSettled(
      providers.map(async (p) => ({
        name: p.name,
        available: await p.isAvailable(),
      }))
    );

    const health: Record<string, boolean> = {};
    healthChecks.forEach((result) => {
      if (result.status === 'fulfilled') {
        health[result.value.name] = result.value.available;
      }
    });

    return health;
  }
}

/**
 * Singleton instance of the aggregator
 */
let aggregatorInstance: ProviderAggregator | null = null;

/**
 * Get or create the global aggregator instance
 */
export function getAggregator(): ProviderAggregator {
  if (!aggregatorInstance) {
    aggregatorInstance = new ProviderAggregator();
  }
  return aggregatorInstance;
}

