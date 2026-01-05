import { Offer, Vertical, SearchParams } from '@/types';
import { PACKAGE_DISCOUNT_RATE } from '@/constants';

export interface PackageOffer {
  id: string;
  type: 'flight-hotel' | 'hotel-car' | 'flight-hotel-car';
  components: {
    flight?: Offer;
    hotel?: Offer;
    car?: Offer;
  };
  basePrice: number;
  taxesFees: number;
  totalPrice: number;
  savings: number; // Savings compared to booking separately
  savingsPercent: number;
  currency: string;
  provider: string;
  title: string;
  subtitle: string;
  image?: string;
  rating?: number;
  reviewCount?: number;
}

/**
 * Calculate savings when bundling offers
 */
function calculateSavings(offers: Offer[]): { savings: number; savingsPercent: number } {
  if (offers.length === 0) {
    return { savings: 0, savingsPercent: 0 };
  }
  
  const individualTotal = offers.reduce((sum, offer) => sum + (offer.total_price || 0), 0);
  if (individualTotal === 0) {
    return { savings: 0, savingsPercent: 0 };
  }
  
  const bundleTotal = individualTotal * PACKAGE_DISCOUNT_RATE; // 15% discount for bundles
  const savings = individualTotal - bundleTotal;
  const savingsPercent = (savings / individualTotal) * 100;

  return { savings, savingsPercent };
}

/**
 * Create Flight + Hotel package
 */
export function createFlightHotelPackage(
  flight: Offer,
  hotel: Offer,
  searchParams: SearchParams
): PackageOffer {
  if (!flight || !hotel) {
    throw new Error('Flight and hotel offers are required');
  }
  
  const { savings, savingsPercent } = calculateSavings([flight, hotel]);
  const bundleTotal = (flight.total_price || 0) + (hotel.total_price || 0) - savings;

  return {
    id: `pkg-fh-${flight.id}-${hotel.id}`,
    type: 'flight-hotel',
    components: { flight, hotel },
    basePrice: (flight.base_price || 0) + (hotel.base_price || 0),
    taxesFees: (flight.taxes_fees || 0) + (hotel.taxes_fees || 0),
    totalPrice: bundleTotal,
    savings,
    savingsPercent,
    currency: flight.currency || hotel.currency || 'USD',
    provider: `${flight.provider} + ${hotel.provider}`,
    title: `${flight.title} + ${hotel.title}`,
    subtitle: `Round-trip flight + ${calculateNights(searchParams)} nights hotel`,
    image: hotel.image || flight.image,
    rating: hotel.rating || flight.rating,
    reviewCount: hotel.reviewCount || flight.reviewCount,
  };
}

/**
 * Create Hotel + Car package
 */
export function createHotelCarPackage(
  hotel: Offer,
  car: Offer,
  searchParams: SearchParams
): PackageOffer {
  if (!hotel || !car) {
    throw new Error('Hotel and car offers are required');
  }
  
  const { savings, savingsPercent } = calculateSavings([hotel, car]);
  const bundleTotal = (hotel.total_price || 0) + (car.total_price || 0) - savings;

  return {
    id: `pkg-hc-${hotel.id}-${car.id}`,
    type: 'hotel-car',
    components: { hotel, car },
    basePrice: (hotel.base_price || 0) + (car.base_price || 0),
    taxesFees: (hotel.taxes_fees || 0) + (car.taxes_fees || 0),
    totalPrice: bundleTotal,
    savings,
    savingsPercent,
    currency: hotel.currency || car.currency || 'USD',
    provider: `${hotel.provider} + ${car.provider}`,
    title: `${hotel.title} + ${car.title}`,
    subtitle: `${calculateNights(searchParams)} nights hotel + car rental`,
    image: hotel.image || car.image,
    rating: hotel.rating || car.rating,
    reviewCount: hotel.reviewCount || car.reviewCount,
  };
}

/**
 * Create Flight + Hotel + Car package
 */
export function createFlightHotelCarPackage(
  flight: Offer,
  hotel: Offer,
  car: Offer,
  searchParams: SearchParams
): PackageOffer {
  if (!flight || !hotel || !car) {
    throw new Error('Flight, hotel, and car offers are required');
  }
  
  const { savings, savingsPercent } = calculateSavings([flight, hotel, car]);
  const bundleTotal = (flight.total_price || 0) + (hotel.total_price || 0) + (car.total_price || 0) - savings;

  return {
    id: `pkg-fhc-${flight.id}-${hotel.id}-${car.id}`,
    type: 'flight-hotel-car',
    components: { flight, hotel, car },
    basePrice: (flight.base_price || 0) + (hotel.base_price || 0) + (car.base_price || 0),
    taxesFees: (flight.taxes_fees || 0) + (hotel.taxes_fees || 0) + (car.taxes_fees || 0),
    totalPrice: bundleTotal,
    savings,
    savingsPercent,
    currency: flight.currency || hotel.currency || car.currency || 'USD',
    provider: `${flight.provider} + ${hotel.provider} + ${car.provider}`,
    title: `${flight.title} + ${hotel.title} + ${car.title}`,
    subtitle: `Round-trip flight + ${calculateNights(searchParams)} nights hotel + car rental`,
    image: hotel.image || flight.image || car.image,
    rating: hotel.rating || flight.rating || car.rating,
    reviewCount: hotel.reviewCount || flight.reviewCount || car.reviewCount,
  };
}

/**
 * Calculate number of nights from search params
 */
function calculateNights(searchParams: SearchParams): number {
  if (!searchParams.startDate || !searchParams.endDate) return 1;
  
  const start = new Date(searchParams.startDate);
  const end = new Date(searchParams.endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(1, diffDays);
}

/**
 * Generate all possible packages from available offers
 */
export function generatePackages(
  flights: Offer[],
  hotels: Offer[],
  cars: Offer[],
  searchParams: SearchParams,
  maxPackages: number = 20
): PackageOffer[] {
  const packages: PackageOffer[] = [];

  // Flight + Hotel packages
  if (flights.length > 0 && hotels.length > 0) {
    // Take top 3 flights and top 3 hotels to create packages
    const topFlights = flights.slice(0, 3);
    const topHotels = hotels.slice(0, 3);
    
    for (const flight of topFlights) {
      for (const hotel of topHotels) {
        try {
          packages.push(createFlightHotelPackage(flight, hotel, searchParams));
        } catch (e) {
          console.error('Error creating flight-hotel package:', e);
          // Skip invalid packages
        }
      }
    }
  }

  // Hotel + Car packages
  if (hotels.length > 0 && cars.length > 0) {
    const topHotels = hotels.slice(0, 3);
    const topCars = cars.slice(0, 3);
    
    for (const hotel of topHotels) {
      for (const car of topCars) {
        packages.push(createHotelCarPackage(hotel, car, searchParams));
      }
    }
  }

  // Flight + Hotel + Car packages
  if (flights.length > 0 && hotels.length > 0 && cars.length > 0) {
    const topFlights = flights.slice(0, 2);
    const topHotels = hotels.slice(0, 2);
    const topCars = cars.slice(0, 2);
    
    for (const flight of topFlights) {
      for (const hotel of topHotels) {
        for (const car of topCars) {
          packages.push(createFlightHotelCarPackage(flight, hotel, car, searchParams));
        }
      }
    }
  }

  // Sort by total price (cheapest first)
  packages.sort((a, b) => a.totalPrice - b.totalPrice);

  // Return top packages
  return packages.slice(0, maxPackages);
}

/**
 * Check if package search is valid (has required components)
 */
export function isValidPackageSearch(
  searchParams: SearchParams,
  availableFlights: number,
  availableHotels: number,
  availableCars: number
): boolean {
  // Need at least one component type
  if (availableFlights === 0 && availableHotels === 0 && availableCars === 0) {
    return false;
  }

  // For Flight + Hotel, need both
  if (availableFlights > 0 && availableHotels > 0) return true;
  
  // For Hotel + Car, need both
  if (availableHotels > 0 && availableCars > 0) return true;
  
  // For Flight + Hotel + Car, need all three
  if (availableFlights > 0 && availableHotels > 0 && availableCars > 0) return true;

  return false;
}

