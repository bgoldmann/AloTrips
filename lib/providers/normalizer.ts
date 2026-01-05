import { Offer, ProviderType, Vertical } from '@/types';

/**
 * Raw provider response - varies by provider
 */
export interface RawProviderOffer {
  // Common fields (may have different names in provider responses)
  id?: string;
  provider?: string;
  vertical?: string;
  title?: string;
  subtitle?: string;
  base_price?: number;
  taxes_fees?: number;
  total_price?: number;
  currency?: string;
  rating?: number;
  reviewCount?: number;
  review_count?: number;
  image?: string;
  refundable?: boolean;
  epc?: number;

  // Flight specific
  stops?: number;
  duration?: string;
  layover_minutes?: number;
  baggage_included?: boolean;
  carryon_included?: boolean;
  flight_number?: string;
  departure_time?: string;
  arrival_time?: string;

  // Hotel specific
  stars?: number;
  amenities?: string[];

  // Car specific
  car_type?: string;
  transmission?: string;
  passengers?: number;
  mileage_limit?: string;

  // Activity/Things to Do specific
  activity_category?: string;
  activity_location?: string;
  activity_duration?: string;
  activity_start_time?: string;
  activity_includes?: string[];
  latitude?: number;
  longitude?: number;

  // Allow any other fields
  [key: string]: any;
}

/**
 * Normalize a raw provider offer to our standard Offer format
 */
export function normalizeOffer(
  raw: RawProviderOffer,
  provider: ProviderType,
  vertical: Vertical,
  defaultEpc: number = 0.15
): Offer {
  // Generate ID if not provided
  const id = raw.id || `${provider}-${vertical}-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

  // Normalize price fields
  const basePrice = raw.base_price ?? raw.price ?? raw.basePrice ?? 0;
  const taxesFees = raw.taxes_fees ?? raw.taxes ?? raw.fees ?? raw.taxesFees ?? 0;
  const totalPrice = raw.total_price ?? raw.totalPrice ?? (basePrice + taxesFees);

  // Normalize rating and reviews
  const rating = raw.rating ?? raw.rating_score ?? raw.star_rating ?? 0;
  const reviewCount = raw.reviewCount ?? raw.review_count ?? raw.reviews_count ?? raw.num_reviews ?? 0;

  // Normalize currency
  const currency = (raw.currency ?? 'USD').toUpperCase();

  // Normalize image
  const image = raw.image ?? raw.image_url ?? raw.photo ?? raw.thumbnail ?? 
    `https://picsum.photos/seed/${id}/300/200`;

  // Normalize refundable
  const refundable = raw.refundable ?? raw.cancellable ?? raw.free_cancellation ?? false;

  // Normalize EPC (earnings per click)
  const epc = raw.epc ?? raw.commission_rate ?? defaultEpc;

  // Build the normalized offer
  const offer: Offer = {
    id,
    provider,
    vertical,
    title: raw.title ?? raw.name ?? 'Untitled Offer',
    subtitle: raw.subtitle ?? raw.airline ?? raw.hotel_name ?? raw.car_company ?? '',
    base_price: basePrice,
    taxes_fees: taxesFees,
    total_price: totalPrice,
    currency,
    rating: Math.max(0, Math.min(5, rating)), // Clamp between 0-5
    reviewCount,
    image,
    refundable,
    epc: Math.max(0, Math.min(1, epc)), // Clamp between 0-1
  };

  // Add vertical-specific fields
  if (vertical === 'flights') {
    offer.stops = raw.stops ?? raw.num_stops ?? 0;
    offer.duration = raw.duration ?? raw.flight_duration ?? raw.duration_text;
    offer.layover_minutes = raw.layover_minutes ?? raw.layover_time ?? 0;
    offer.baggage_included = raw.baggage_included ?? raw.baggage ?? false;
    offer.carryon_included = raw.carryon_included ?? raw.carry_on ?? true;
    offer.flight_number = raw.flight_number ?? raw.flightNumber ?? raw.flight_code;
    offer.departure_time = raw.departure_time ?? raw.departure ?? raw.dep_time;
    offer.arrival_time = raw.arrival_time ?? raw.arrival ?? raw.arr_time;
  }

  if (vertical === 'stays') {
    offer.stars = raw.stars ?? raw.star_rating ?? raw.hotel_stars;
    offer.amenities = Array.isArray(raw.amenities) 
      ? raw.amenities 
      : (raw.amenities_list ?? raw.features ?? []);
  }

  if (vertical === 'cars') {
    offer.car_type = raw.car_type ?? raw.vehicle_type ?? raw.category;
    offer.transmission = raw.transmission ?? raw.transmission_type;
    offer.passengers = raw.passengers ?? raw.seats ?? raw.capacity;
    offer.mileage_limit = raw.mileage_limit ?? raw.mileage ?? raw.mileage_policy ?? 'Unlimited';
  }

      if (vertical === 'things-to-do') {
        offer.activity_category = raw.activity_category ?? raw.category ?? raw.type;
        offer.activity_location = raw.activity_location ?? raw.location ?? raw.address;
        offer.activity_duration = raw.activity_duration ?? raw.duration ?? raw.duration_text;
        offer.activity_start_time = raw.activity_start_time ?? raw.start_time ?? raw.startTime;
        offer.activity_includes = Array.isArray(raw.activity_includes)
          ? raw.activity_includes
          : (raw.includes ?? raw.whats_included ?? []);
        offer.latitude = raw.latitude ?? raw.lat;
        offer.longitude = raw.longitude ?? raw.lng ?? raw.lon;
      }

      if (vertical === 'cruises') {
        offer.cruise_line = raw.cruise_line ?? raw.cruiseLine ?? raw.line;
        offer.cruise_region = raw.cruise_region ?? raw.region ?? raw.destination_region;
        offer.cruise_duration = raw.cruise_duration ?? raw.duration_nights ?? raw.nights;
        offer.cruise_ports = Array.isArray(raw.cruise_ports)
          ? raw.cruise_ports
          : (raw.ports ?? raw.ports_of_call ?? []);
        offer.cruise_ship = raw.cruise_ship ?? raw.ship_name ?? raw.ship;
        offer.cruise_departure_port = raw.cruise_departure_port ?? raw.departure_port ?? raw.departurePort;
        offer.cruise_itinerary = raw.cruise_itinerary ?? raw.itinerary ?? raw.description;
        offer.cruise_cabin_type = raw.cruise_cabin_type ?? raw.cabin_type ?? raw.cabinType;
        // For cruises, subtitle could be the cruise line or ship
        offer.subtitle = offer.cruise_line || offer.cruise_ship || offer.subtitle;
      }

      return offer;
}

/**
 * Normalize an array of raw provider offers
 */
export function normalizeOffers(
  rawOffers: RawProviderOffer[],
  provider: ProviderType,
  vertical: Vertical,
  defaultEpc: number = 0.15
): Offer[] {
  return rawOffers
    .filter(raw => raw !== null && raw !== undefined)
    .map(raw => normalizeOffer(raw, provider, vertical, defaultEpc))
    .filter(offer => offer.base_price > 0 && offer.total_price > 0); // Remove invalid offers
}

/**
 * Validate that an offer has minimum required fields
 */
export function validateOffer(offer: Offer): boolean {
  return !!(
    offer.id &&
    offer.provider &&
    offer.vertical &&
    offer.title &&
    offer.base_price >= 0 &&
    offer.total_price >= 0 &&
    offer.currency
  );
}

