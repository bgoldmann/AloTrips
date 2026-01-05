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
  
  // Logic Props
  refundable: boolean;
  epc: number; // Earnings Per Click (simulated)
  
  // UI State
  isCheapest?: boolean;
  isBestValue?: boolean;
}

export interface SearchParams {
  origin?: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
}

export interface TieSetConfig {
  priceTieThresholdAbsolute: number;
  priceTieThresholdPercent: number;
}

export interface UpsellConfig {
  showEsim: boolean;
  showInsurance: boolean;
}

// User & Admin Types

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