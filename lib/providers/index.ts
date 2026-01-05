/**
 * Provider adapter exports
 * 
 * This module exports all provider adapters and utilities
 */

export * from './base';
export * from './normalizer';
export * from './aggregator';
export * from './travelpayouts';
export * from './skyscanner';
export * from './expedia';
export * from './kiwi';

import { ProviderAggregator, getAggregator } from './aggregator';
import { TravelpayoutsAdapter } from './travelpayouts';
import { SkyscannerAdapter } from './skyscanner';
import { ExpediaAdapter } from './expedia';
import { KiwiAdapter } from './kiwi';
import { ProviderConfig } from './base';

/**
 * Initialize all providers and register them with the aggregator
 */
export function initializeProviders(configs: {
  travelpayouts?: ProviderConfig;
  skyscanner?: ProviderConfig;
  expedia?: ProviderConfig;
  kiwi?: ProviderConfig;
} = {}): ProviderAggregator {
  const aggregator = getAggregator();

  // Initialize and register Travelpayouts
  if (configs.travelpayouts?.enabled !== false) {
    const travelpayouts = new TravelpayoutsAdapter(configs.travelpayouts);
    aggregator.register(travelpayouts);
  }

  // Initialize and register Skyscanner
  if (configs.skyscanner?.enabled !== false) {
    const skyscanner = new SkyscannerAdapter(configs.skyscanner);
    aggregator.register(skyscanner);
  }

  // Initialize and register Expedia
  if (configs.expedia?.enabled !== false) {
    const expedia = new ExpediaAdapter(configs.expedia);
    aggregator.register(expedia);
  }

  // Initialize and register Kiwi
  if (configs.kiwi?.enabled !== false) {
    const kiwi = new KiwiAdapter(configs.kiwi);
    aggregator.register(kiwi);
  }

  return aggregator;
}

/**
 * Get provider configurations from environment variables
 */
export function getProviderConfigsFromEnv(): {
  travelpayouts?: ProviderConfig;
  skyscanner?: ProviderConfig;
  expedia?: ProviderConfig;
  kiwi?: ProviderConfig;
} {
  return {
    travelpayouts: {
      apiKey: process.env.TRAVELPAYOUTS_API_KEY,
      apiUrl: process.env.TRAVELPAYOUTS_API_URL,
      timeout: parseInt(process.env.TRAVELPAYOUTS_TIMEOUT || '10000'),
      enabled: process.env.TRAVELPAYOUTS_ENABLED !== 'false',
      affiliateId: process.env.TRAVELPAYOUTS_AFFILIATE_ID,
    },
    skyscanner: {
      apiKey: process.env.SKYSCANNER_API_KEY,
      apiUrl: process.env.SKYSCANNER_API_URL,
      timeout: parseInt(process.env.SKYSCANNER_TIMEOUT || '10000'),
      enabled: process.env.SKYSCANNER_ENABLED !== 'false',
    },
    expedia: {
      apiKey: process.env.EXPEDIA_API_KEY,
      apiUrl: process.env.EXPEDIA_API_URL,
      timeout: parseInt(process.env.EXPEDIA_TIMEOUT || '10000'),
      enabled: process.env.EXPEDIA_ENABLED !== 'false',
      affiliateId: process.env.EXPEDIA_AFFILIATE_ID,
    },
    kiwi: {
      apiKey: process.env.KIWI_API_KEY,
      apiUrl: process.env.KIWI_API_URL,
      timeout: parseInt(process.env.KIWI_TIMEOUT || '10000'),
      enabled: process.env.KIWI_ENABLED !== 'false',
    },
  };
}

