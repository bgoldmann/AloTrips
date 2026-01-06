import { ProviderAdapter, ProviderConfig } from './base';
import { Offer, Vertical, SearchParams, ProviderType } from '@/types';
import { normalizeOffers, RawProviderOffer } from './normalizer';
import { DEFAULT_EPC } from '@/constants';

/**
 * Expedia Rapid API provider adapter
 * Supports: Flights, Hotels (Stays), Cars
 * 
 * Note: This is a stub implementation. Replace with actual Expedia Rapid API integration
 * when API access is available.
 */
export class ExpediaAdapter implements ProviderAdapter {
  readonly name = 'expedia';
  readonly supportedVerticals: Vertical[] = ['flights', 'stays', 'cars', 'things-to-do', 'cruises'];
  
  private config: ProviderConfig;
  private defaultEpc = DEFAULT_EPC.stays;

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
      // TODO: Replace with actual Expedia Rapid API call
      const mockOffers = this.getMockOffers(vertical, searchParams);
      
      const normalized = normalizeOffers(
        mockOffers as RawProviderOffer[],
        ProviderType.EXPEDIA,
        vertical,
        this.defaultEpc
      );

      return normalized;
    } catch (error) {
      console.error(`[Expedia] Search error:`, error);
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
          id: 'exp-flight-1',
          title: `${searchParams.origin || 'NYC'} → ${searchParams.destination}`,
          subtitle: 'Virgin Atlantic',
          base_price: 355,
          taxes_fees: 78,
          currency: 'USD',
          rating: 4.5,
          review_count: 1800,
          stops: 0,
          duration: '7h 00m',
          layover_minutes: 0,
          baggage_included: true,
          carryon_included: true,
          refundable: true,
          flight_number: 'VS 004',
          departure_time: '20:00',
          arrival_time: '08:00+1',
          epc: 0.35,
          member_price: 320, // 10% discount for members
          member_tier_required: 'Silver',
        },
      ];
    }

    if (vertical === 'stays') {
      return [
        {
          id: 'exp-hotel-1',
          title: 'Arlo NoMad',
          subtitle: searchParams.destination,
          base_price: 158,
          taxes_fees: 35,
          currency: 'USD',
          rating: 4.6,
          review_count: 980,
          stars: 4,
          amenities: ['Wifi', 'City View', 'Gym'],
          refundable: true,
          epc: 0.50,
          member_price: 142, // 10% discount for members
          member_tier_required: 'Silver',
        },
        {
          id: 'exp-hotel-2',
          title: 'Luxury Resort & Spa',
          subtitle: searchParams.destination,
          base_price: 250,
          taxes_fees: 45,
          currency: 'USD',
          rating: 4.8,
          review_count: 1500,
          stars: 5,
          amenities: ['Pool', 'Spa', 'Restaurant', 'Beach Access'],
          refundable: true,
          epc: 0.55,
          member_price: 220, // 12% discount for Gold+ members
          member_tier_required: 'Gold',
        },
      ];
    }

    if (vertical === 'cars') {
      return [
        {
          id: 'exp-car-1',
          title: 'Toyota Corolla or similar',
          subtitle: 'Hertz',
          base_price: 42,
          taxes_fees: 18,
          currency: 'USD',
          rating: 4.8,
          review_count: 1500,
          car_type: 'Intermediate',
          transmission: 'Automatic',
          passengers: 5,
          mileage_limit: 'Unlimited',
          refundable: true,
          epc: 0.22,
        },
      ];
    }

    if (vertical === 'things-to-do') {
      return [
        {
          id: 'exp-activity-1',
          title: 'City Walking Tour',
          subtitle: searchParams.destination,
          base_price: 25,
          taxes_fees: 5,
          currency: 'USD',
          rating: 4.5,
          review_count: 320,
          activity_category: 'Tours',
          activity_location: 'City Center',
          activity_duration: '2 hours',
          activity_start_time: '09:00',
          activity_includes: ['Professional Guide', 'Audio Equipment'],
          refundable: true,
          latitude: 40.7128 + (Math.random() - 0.5) * 0.05,
          longitude: -74.0060 + (Math.random() - 0.5) * 0.05,
          epc: 0.30,
        },
        {
          id: 'exp-activity-2',
          title: 'Museum Entry Ticket',
          subtitle: searchParams.destination,
          base_price: 18,
          taxes_fees: 2,
          currency: 'USD',
          rating: 4.7,
          review_count: 1200,
          activity_category: 'Attractions',
          activity_location: 'Museum District',
          activity_duration: '3 hours',
          activity_start_time: 'Flexible',
          activity_includes: ['Skip-the-line', 'Audio Guide'],
          refundable: true,
          latitude: 40.7128 + (Math.random() - 0.5) * 0.05,
          longitude: -74.0060 + (Math.random() - 0.5) * 0.05,
          epc: 0.25,
        },
        {
          id: 'exp-activity-3',
          title: 'Food & Culture Experience',
          subtitle: searchParams.destination,
          base_price: 65,
          taxes_fees: 8,
          currency: 'USD',
          rating: 4.8,
          review_count: 580,
          activity_category: 'Food & Drink',
          activity_location: 'Historic District',
          activity_duration: '4 hours',
          activity_start_time: '18:00',
          activity_includes: ['Local Guide', 'Food Tastings', 'Drinks'],
          refundable: true,
          latitude: 40.7128 + (Math.random() - 0.5) * 0.05,
          longitude: -74.0060 + (Math.random() - 0.5) * 0.05,
          epc: 0.35,
        },
        {
          id: 'exp-activity-4',
          title: 'Adventure Day Trip',
          subtitle: searchParams.destination,
          base_price: 95,
          taxes_fees: 10,
          currency: 'USD',
          rating: 4.6,
          review_count: 420,
          activity_category: 'Adventures',
          activity_location: 'Outdoor Area',
          activity_duration: 'Full day',
          activity_start_time: '08:00',
          activity_includes: ['Transportation', 'Equipment', 'Lunch'],
          refundable: false,
          latitude: 40.7128 + (Math.random() - 0.5) * 0.05,
          longitude: -74.0060 + (Math.random() - 0.5) * 0.05,
          epc: 0.28,
        },
      ];
    }

    return [];
  }
}

