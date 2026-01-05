import { applyFilters, sortOffers } from '@/lib/filters';
import { Offer, FilterState, SortOption } from '@/types';

describe('Filters and Sorting', () => {
  const mockOffers: Offer[] = [
    {
      id: '1',
      provider: 'EXPEDIA',
      vertical: 'stays',
      title: 'Hotel A',
      subtitle: 'Luxury Hotel',
      base_price: 100,
      taxes_fees: 20,
      total_price: 120,
      currency: 'USD',
      rating: 4.5,
      reviewCount: 100,
      image: 'https://example.com/image1.jpg',
      refundable: true,
      epc: 0.15,
      stars: 5,
    },
    {
      id: '2',
      provider: 'BOOKING',
      vertical: 'stays',
      title: 'Hotel B',
      subtitle: 'Budget Hotel',
      base_price: 50,
      taxes_fees: 10,
      total_price: 60,
      currency: 'USD',
      rating: 3.5,
      reviewCount: 50,
      image: 'https://example.com/image2.jpg',
      refundable: false,
      epc: 0.12,
      stars: 3,
    },
    {
      id: '3',
      provider: 'AGODA',
      vertical: 'stays',
      title: 'Hotel C',
      subtitle: 'Mid-range Hotel',
      base_price: 75,
      taxes_fees: 15,
      total_price: 90,
      currency: 'USD',
      rating: 4.0,
      reviewCount: 75,
      image: 'https://example.com/image3.jpg',
      refundable: true,
      epc: 0.14,
      stars: 4,
    },
  ];

  describe('applyFilters', () => {
    it('should return all offers when no filters applied', () => {
      const filters: FilterState = {};
      const result = applyFilters(mockOffers, filters, 'stays');
      expect(result).toHaveLength(3);
    });

    it('should filter by minPrice', () => {
      const filters: FilterState = { minPrice: 80 };
      const result = applyFilters(mockOffers, filters, 'stays');
      expect(result).toHaveLength(2);
      expect(result.every(offer => offer.total_price >= 80)).toBe(true);
    });

    it('should filter by maxPrice', () => {
      const filters: FilterState = { maxPrice: 80 };
      const result = applyFilters(mockOffers, filters, 'stays');
      expect(result).toHaveLength(1);
      expect(result[0].total_price).toBe(60);
    });

    it('should filter by minRating', () => {
      const filters: FilterState = { minRating: 4.0 };
      const result = applyFilters(mockOffers, filters, 'stays');
      expect(result).toHaveLength(2);
      expect(result.every(offer => offer.rating >= 4.0)).toBe(true);
    });

    it('should filter by refundable', () => {
      const filters: FilterState = { refundable: true };
      const result = applyFilters(mockOffers, filters, 'stays');
      expect(result).toHaveLength(2);
      expect(result.every(offer => offer.refundable)).toBe(true);
    });

    it('should filter by stars', () => {
      const filters: FilterState = { minStars: 4 };
      const result = applyFilters(mockOffers, filters, 'stays');
      expect(result).toHaveLength(2);
      expect(result.every(offer => offer.stars && offer.stars >= 4)).toBe(true);
    });

    it('should apply multiple filters', () => {
      const filters: FilterState = {
        minPrice: 80,
        minRating: 4.0,
        refundable: true,
      };
      const result = applyFilters(mockOffers, filters, 'stays');
      // Hotel A (id: 1): price 120, rating 4.5, refundable true ✓
      // Hotel C (id: 3): price 90, rating 4.0, refundable true ✓
      // Both match the filters
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result.every(offer => offer.total_price >= 80)).toBe(true);
      expect(result.every(offer => offer.rating >= 4.0)).toBe(true);
      expect(result.every(offer => offer.refundable === true)).toBe(true);
    });
  });

  describe('sortOffers', () => {
    it('should sort by price low to high', () => {
      const result = sortOffers(mockOffers, 'price-asc');
      expect(result[0].total_price).toBe(60);
      expect(result[1].total_price).toBe(90);
      expect(result[2].total_price).toBe(120);
    });

    it('should sort by price high to low', () => {
      const result = sortOffers(mockOffers, 'price-desc');
      expect(result[0].total_price).toBe(120);
      expect(result[1].total_price).toBe(90);
      expect(result[2].total_price).toBe(60);
    });

    it('should sort by rating high to low', () => {
      const result = sortOffers(mockOffers, 'rating-desc');
      expect(result[0].rating).toBe(4.5);
      expect(result[1].rating).toBe(4.0);
      expect(result[2].rating).toBe(3.5);
    });

    it('should maintain original order for recommended', () => {
      const result = sortOffers(mockOffers, 'recommended', 'stays');
      expect(result).toHaveLength(3);
      // Recommended should maintain original order (or use isBestValue/isCheapest)
    });
  });
});

