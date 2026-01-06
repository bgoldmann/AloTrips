/**
 * Database row types
 * These represent the structure of rows returned from Supabase
 */

import { ProviderType, Vertical } from '../types';

export interface DatabaseOfferRow {
  id: string;
  provider: ProviderType | string;
  vertical: Vertical | string;
  title: string;
  subtitle: string;
  base_price: number | string;
  taxes_fees: number | string;
  total_price: number | string;
  currency: string;
  rating: number | string;
  review_count: number;
  image: string | null;
  stops: number | null;
  duration: string | null;
  layover_minutes: number | null;
  baggage_included: boolean | null;
  carryon_included: boolean | null;
  flight_number: string | null;
  departure_time: string | null;
  arrival_time: string | null;
  stars: number | null;
  amenities: string[] | null;
  car_type: string | null;
  transmission: string | null;
  passengers: number | null;
  mileage_limit: string | null;
  refundable: boolean;
  epc: number | string;
  is_cheapest: boolean;
  is_best_value: boolean;
}

