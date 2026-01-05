import { ProviderAdapter, ProviderConfig } from './base';
import { Offer, Vertical, SearchParams, ProviderType } from '@/types';
import { normalizeOffers, RawProviderOffer } from './normalizer';
import { DEFAULT_EPC } from '@/constants';

/**
 * Kiwi Tequila API provider adapter
 * Supports: Flights (low-cost carriers)
 * 
 * Note: This is a stub implementation. Replace with actual Kiwi Tequila API integration
 * when API access is available.
 */
export class KiwiAdapter implements ProviderAdapter {
  readonly name = 'kiwi';
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
      // TODO: Replace with actual Kiwi Tequila API call
      const mockOffers = this.getMockOffers(vertical, searchParams);
      
      const normalized = normalizeOffers(
        mockOffers as RawProviderOffer[],
        ProviderType.KIWI,
        vertical,
        this.defaultEpc
      );

      return normalized;
    } catch (error) {
      console.error(`[Kiwi] Search error:`, error);
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
          id: 'kiwi-flight-1',
          title: `${searchParams.origin || 'NYC'} → ${searchParams.destination}`,
          subtitle: 'Norse Atlantic',
          base_price: 320,
          taxes_fees: 45,
          currency: 'USD',
          rating: 3.5,
          review_count: 120,
          stops: 0,
          duration: '7h 10m',
          layover_minutes: 0,
          baggage_included: false,
          carryon_included: true,
          refundable: false,
          flight_number: 'N0 201',
          departure_time: '18:30',
          arrival_time: '06:40+1',
          epc: 0.10,
        },
        {
          id: 'kiwi-flight-2',
          title: `${searchParams.origin || 'NYC'} → ${searchParams.destination}`,
          subtitle: 'Ryanair',
          base_price: 280,
          taxes_fees: 35,
          currency: 'USD',
          rating: 3.2,
          review_count: 950,
          stops: 0,
          duration: '8h 00m',
          layover_minutes: 0,
          baggage_included: false,
          carryon_included: true,
          refundable: false,
          flight_number: 'FR 123',
          departure_time: '12:00',
          arrival_time: '20:00',
          epc: 0.08,
        },
      ];
    }

    return [];
  }
}

