export type Vertical = 'stays' | 'flights' | 'cars' | 'packages' | 'cruises' | 'things-to-do';

export enum ProviderType {
  EXPEDIA = 'expedia',
  TRAVELPAYOUTS = 'travelpayouts',
  SKYSCANNER = 'skyscanner',
  KIWI = 'kiwi',
  BOOKING = 'booking',
  AGODA = 'agoda'
}

export interface Offer {
  id: string;
  provider: ProviderType;
  vertical: Vertical;
  title: string;
  subtitle: string; // Airline or Hotel Name or Car Rental Company
  base_price: number;
  taxes_fees: number;
  total_price: number; // calculated
  currency: string;
  rating: number;
  reviewCount: number;
  image: string;
  
  // Flight Specifics
  stops?: number;
  duration?: string; // "5h 20m"
  layover_minutes?: number;
  baggage_included?: boolean;
  carryon_included?: boolean;
  flight_number?: string;
  departure_time?: string;
  arrival_time?: string;
  
  // Hotel Specifics
  stars?: number;
  amenities?: string[];

  // Car Specifics
  car_type?: string; // Economy, SUV
  transmission?: string; // Automatic, Manual
  passengers?: number;
  mileage_limit?: string; // Unlimited, 200mi/day
  
  // Activity/Things to Do Specifics
  activity_category?: string; // Tours, Attractions, Experiences, etc.
  activity_location?: string; // Specific location/address
  activity_duration?: string; // "2 hours", "Full day", etc.
  activity_start_time?: string; // "09:00", "Flexible", etc.
  activity_includes?: string[]; // What's included (guide, equipment, etc.)
  latitude?: number; // For map display
  longitude?: number; // For map display
  
  // Logic Props
  refundable: boolean;
  epc: number; // Earnings Per Click (simulated)
  
  // Member Pricing
  member_price?: number; // Member-exclusive price (optional)
  member_tier_required?: 'Silver' | 'Gold' | 'Platinum'; // Minimum tier required
  
  // UI State
  isCheapest?: boolean;
  isBestValue?: boolean;
}

export type TripType = 'round-trip' | 'one-way' | 'multi-city';

export interface SearchParams {
  origin?: string;
  destination: string;
  startDate: string;
  endDate?: string; // Optional for one-way trips
  travelers: number;
  adults?: number;
  children?: number;
  rooms?: number;
  tripType?: TripType;
  flexibleDays?: number; // ±N days flexibility for calendar flexible dates
  includeNearbyAirports?: boolean; // Include nearby airports in flight search
  flightSegments?: FlightSegment[]; // For multi-city flights
}

export interface FlightSegment {
  origin: string;
  destination: string;
  date: Date | string;
}

export interface TieSetConfig {
  priceTieThresholdAbsolute: number;
  priceTieThresholdPercent: number;
}

export interface UpsellConfig {
  showEsim: boolean;
  showInsurance: boolean;
}

// Filter & Sort Types
export type SortOption = 'price-asc' | 'price-desc' | 'rating-desc' | 'duration-asc' | 'duration-desc' | 'recommended';

export interface FilterState {
  // Price range
  minPrice?: number;
  maxPrice?: number;
  
  // Flights
  maxStops?: number;
  airlines?: string[];
  departureTimeStart?: string; // HH:mm format
  departureTimeEnd?: string; // HH:mm format
  maxDuration?: number; // in minutes
  
  // Stays
  minStars?: number;
  minRating?: number;
  refundable?: boolean;
  amenities?: string[];
  
  // Cars
  carClass?: string[];
  suppliers?: string[];
  transmission?: string[];
  unlimitedMileage?: boolean;
  
  // Activities
  activityCategory?: string[];
  activityDuration?: string[];
  
  // Cruises
  cruiseLines?: string[];
  cruiseRegions?: string[];
  cruiseDurationMin?: number;
  cruiseDurationMax?: number;
  cruiseCabinType?: string[];
  cruiseDeparturePort?: string[];
}

export interface SortState {
  sortBy: SortOption;
}

// User & Admin Types

// Re-export API types
export type { SearchApiResponse, PackageSearchApiResponse, SearchResponse } from './types/api';

// Re-export database types
export type { DatabaseOfferRow } from './types/database';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  homeAirport: string;
  currencyPreference: 'USD' | 'EUR';
  memberSince: string;
  tier: 'Silver' | 'Gold' | 'Platinum';
  points: number;
}

export interface Booking {
  id: string;
  date: string;
  itemTitle: string;
  type: 'Flight' | 'Hotel' | 'Car';
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  amount: number;
  currency: string;
  provider: string;
  customerName: string;
}

export interface AdminStats {
  totalRevenue: number;
  totalBookings: number;
  activeUsers: number;
  growth: number; // percentage
  revenueHistory: { date: string; value: number }[];
}