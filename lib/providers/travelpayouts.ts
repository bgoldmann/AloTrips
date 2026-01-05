import { ProviderAdapter, ProviderConfig, ProviderResponse } from './base';
import { Offer, Vertical, SearchParams, ProviderType } from '@/types';
import { normalizeOffers, RawProviderOffer } from './normalizer';
import { DEFAULT_EPC } from '@/constants';

/**
 * Travelpayouts provider adapter
 * Supports: Flights, Hotels (Stays)
 * 
 * Note: This is a stub implementation. Replace with actual Travelpayouts API integration
 * when API access is available.
 */
export class TravelpayoutsAdapter implements ProviderAdapter {
  readonly name = 'travelpayouts';
  readonly supportedVerticals: Vertical[] = ['flights', 'stays'];
  
  private config: ProviderConfig;
  private defaultEpc = DEFAULT_EPC.flights;

  constructor(config: ProviderConfig = {}) {
    this.config = {
      timeout: 10000, // 10 seconds
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
      // TODO: Replace with actual Travelpayouts API call
      // For now, return mock data that matches Travelpayouts response format
      const mockOffers = this.getMockOffers(vertical, searchParams);
      
      // Normalize the mock response to our Offer format
      const normalized = normalizeOffers(
        mockOffers as RawProviderOffer[],
        ProviderType.TRAVELPAYOUTS,
        vertical,
        this.defaultEpc
      );

      return normalized;
    } catch (error) {
      console.error(`[Travelpayouts] Search error:`, error);
      return [];
    }
  }

  async isAvailable(): Promise<boolean> {
    if (!this.config.enabled) {
      return false;
    }

    // TODO: Implement actual health check
    // For now, return true if config is present
    return !!this.config.apiKey;
  }

  /**
   * Mock data generator - replace with actual API call
   */
  private getMockOffers(vertical: Vertical, searchParams: SearchParams): any[] {
    if (vertical === 'flights') {
      return [
        {
          id: 'tp-flight-1',
          title: `${searchParams.origin || 'NYC'} → ${searchParams.destination}`,
          subtitle: 'JetBlue',
          base_price: 330,
          taxes_fees: 50,
          currency: 'USD',
          rating: 4.0,
          review_count: 800,
          stops: 1,
          duration: '9h 15m',
          layover_minutes: 90,
          baggage_included: false,
          carryon_included: true,
          refundable: false,
          flight_number: 'B6 230',
          departure_time: '14:45',
          arrival_time: '05:00+1',
          epc: 0.18,
        },
        {
          id: 'tp-flight-2',
          title: `${searchParams.origin || 'NYC'} → ${searchParams.destination}`,
          subtitle: 'American Airlines',
          base_price: 380,
          taxes_fees: 65,
          currency: 'USD',
          rating: 4.2,
          review_count: 1200,
          stops: 0,
          duration: '7h 30m',
          layover_minutes: 0,
          baggage_included: true,
          carryon_included: true,
          refundable: true,
          flight_number: 'AA 100',
          departure_time: '10:00',
          arrival_time: '17:30',
          epc: 0.20,
        },
      ];
    }

    if (vertical === 'stays') {
      return [
        {
          id: 'tp-hotel-1',
          title: 'Budget Hotel Downtown',
          subtitle: searchParams.destination,
          base_price: 85,
          taxes_fees: 20,
          currency: 'USD',
          rating: 3.5,
          review_count: 450,
          stars: 3,
          amenities: ['Wifi', 'AC', 'Parking'],
          refundable: false,
          epc: 0.22,
        },
        {
          id: 'tp-hotel-2',
          title: 'Mid-Range Hotel Center',
          subtitle: searchParams.destination,
          base_price: 120,
          taxes_fees: 25,
          currency: 'USD',
          rating: 4.2,
          review_count: 850,
          stars: 4,
          amenities: ['Wifi', 'Gym', 'Breakfast'],
          refundable: true,
          epc: 0.28,
        },
      ];
    }

    return [];
  }
}

