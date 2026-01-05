import { ProviderAdapter, ProviderConfig } from './base';
import { Offer, Vertical, SearchParams, ProviderType } from '@/types';
import { normalizeOffers, RawProviderOffer } from './normalizer';
import { DEFAULT_EPC } from '@/constants';

/**
 * Skyscanner provider adapter
 * Supports: Flights
 * 
 * Note: This is a stub implementation. Replace with actual Skyscanner API integration
 * when API access is available.
 */
export class SkyscannerAdapter implements ProviderAdapter {
  readonly name = 'skyscanner';
  readonly supportedVerticals: Vertical[] = ['flights'];
  
  private config: ProviderConfig;
  private defaultEpc = DEFAULT_EPC.flights;

  constructor(config: ProviderConfig = {}) {
    this.config = {
      timeout: 10000,
      enabled: true,
      ...config,
    };
  }

  async search(vertical: Vertical, searchParams: SearchParams): Promise<Offer[]> {
    if (!this.supportedVerticals.includes(vertical)) {
      return [];
    }

    if (!this.config.enabled) {
      return [];
    }

    try {
      // TODO: Replace with actual Skyscanner API call
      const mockOffers = this.getMockOffers(vertical, searchParams);
      
      const normalized = normalizeOffers(
        mockOffers as RawProviderOffer[],
        ProviderType.SKYSCANNER,
        vertical,
        this.defaultEpc
      );

      return normalized;
    } catch (error) {
      console.error(`[Skyscanner] Search error:`, error);
      return [];
    }
  }

  async isAvailable(): Promise<boolean> {
    if (!this.config.enabled) {
      return false;
    }

    return !!this.config.apiKey;
  }

  private getMockOffers(vertical: Vertical, searchParams: SearchParams): any[] {
    if (vertical === 'flights') {
      return [
        {
          id: 'sky-flight-1',
          title: `${searchParams.origin || 'NYC'} → ${searchParams.destination}`,
          subtitle: 'British Airways',
          base_price: 350,
          taxes_fees: 80,
          currency: 'USD',
          rating: 4.2,
          review_count: 2500,
          stops: 0,
          duration: '6h 55m',
          layover_minutes: 0,
          baggage_included: true,
          carryon_included: true,
          refundable: true,
          flight_number: 'BA 112',
          departure_time: '19:15',
          arrival_time: '07:10+1',
          epc: 0.25,
        },
        {
          id: 'sky-flight-2',
          title: `${searchParams.origin || 'NYC'} → ${searchParams.destination}`,
          subtitle: 'Lufthansa',
          base_price: 420,
          taxes_fees: 95,
          currency: 'USD',
          rating: 4.4,
          review_count: 3200,
          stops: 1,
          duration: '10h 20m',
          layover_minutes: 120,
          baggage_included: true,
          carryon_included: true,
          refundable: true,
          flight_number: 'LH 400',
          departure_time: '15:30',
          arrival_time: '08:50+1',
          epc: 0.22,
        },
      ];
    }

    return [];
  }
}

