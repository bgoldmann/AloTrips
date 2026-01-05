import { Offer, Vertical, SearchParams } from '@/types';

/**
 * Base interface that all provider adapters must implement
 */
export interface ProviderAdapter {
  /**
   * Unique identifier for this provider
   */
  readonly name: string;

  /**
   * List of verticals this provider supports
   */
  readonly supportedVerticals: Vertical[];

  /**
   * Search for offers from this provider
   * @param vertical - The travel vertical to search (flights, stays, etc.)
   * @param searchParams - Search parameters (origin, destination, dates, etc.)
   * @returns Promise resolving to array of offers from this provider
   */
  search(
    vertical: Vertical,
    searchParams: SearchParams
  ): Promise<Offer[]>;

  /**
   * Check if provider is available/healthy
   * @returns Promise resolving to true if provider is available
   */
  isAvailable(): Promise<boolean>;
}

/**
 * Configuration for provider adapters
 */
export interface ProviderConfig {
  apiKey?: string;
  apiUrl?: string;
  timeout?: number; // in milliseconds
  enabled?: boolean;
  affiliateId?: string;
}

/**
 * Provider response wrapper with metadata
 */
export interface ProviderResponse<T = Offer[]> {
  provider: string;
  data: T;
  cached: boolean;
  responseTime: number; // in milliseconds
  error?: string;
  fallback?: boolean; // Indicates this is fallback data (e.g., from cache when provider failed)
}

/**
 * Cache entry for provider responses
 */
export interface CacheEntry {
  key: string;
  data: Offer[];
  timestamp: number;
  ttl: number; // time to live in milliseconds
}

