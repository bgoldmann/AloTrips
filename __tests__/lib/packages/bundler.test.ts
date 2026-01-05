import {
  createFlightHotelPackage,
} from '@/lib/packages';
import { Offer } from '@/types';

describe('Package Bundler', () => {
  const mockFlight: Offer = {
    id: 'flight-1',
    provider: 'EXPEDIA',
    vertical: 'flights',
    title: 'Flight',
    subtitle: 'Airline',
    base_price: 500,
    taxes_fees: 100,
    total_price: 600,
    currency: 'USD',
    rating: 4.5,
    reviewCount: 100,
    image: 'https://example.com/flight.jpg',
    refundable: true,
    epc: 0.15,
  };

  const mockHotel: Offer = {
    id: 'hotel-1',
    provider: 'BOOKING',
    vertical: 'stays',
    title: 'Hotel',
    subtitle: 'Luxury Hotel',
    base_price: 200,
    taxes_fees: 40,
    total_price: 240,
    currency: 'USD',
    rating: 4.5,
    reviewCount: 100,
    image: 'https://example.com/hotel.jpg',
    refundable: true,
    epc: 0.12,
    stars: 5,
  };


  describe('createFlightHotelPackage', () => {
    it('should create a valid package', () => {
      const searchParams = {
        destination: 'Paris',
        startDate: '2024-06-01',
        endDate: '2024-06-05',
      };
      
      const packageOffer = createFlightHotelPackage(
        mockFlight,
        mockHotel,
        searchParams
      );
      
      expect(packageOffer).toBeDefined();
      expect(packageOffer.type).toBe('flight-hotel');
      expect(packageOffer.components.flight).toBe(mockFlight);
      expect(packageOffer.components.hotel).toBe(mockHotel);
      expect(packageOffer.totalPrice).toBeGreaterThan(0);
      expect(packageOffer.savings).toBeGreaterThanOrEqual(0);
    });

    it('should handle missing flight', () => {
      const searchParams = {
        destination: 'Paris',
        startDate: '2024-06-01',
        endDate: '2024-06-05',
      };
      
      expect(() => {
        createFlightHotelPackage(null as any, mockHotel, searchParams);
      }).toThrow();
    });

    it('should handle missing hotel', () => {
      const searchParams = {
        destination: 'Paris',
        startDate: '2024-06-01',
        endDate: '2024-06-05',
      };
      
      expect(() => {
        createFlightHotelPackage(mockFlight, null as any, searchParams);
      }).toThrow();
    });
  });
});

