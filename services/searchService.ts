import { Offer, Vertical, TieSetConfig } from '../types';
import { PROVIDER_TRUST_MULTIPLIER, TIE_SET_CONFIG, PRICE_PENALTIES } from '../constants';
import { ProviderType } from '../types';
import { DatabaseOfferRow } from '../types/database';

// PRD 12.3: Total Price Calculation
const computeTotalPrice = (offer: Partial<Offer>): number => {
  let total = (offer.base_price || 0) + (offer.taxes_fees || 0);
  let penalty = 0;

  // Anti-Fake-Cheap logic from PRD
  if (offer.baggage_included === undefined || offer.baggage_included === false) {
    penalty += PRICE_PENALTIES.NO_BAGgage;
  }
  if (offer.carryon_included === false) {
    penalty += PRICE_PENALTIES.NO_CARRYON;
  }
  if ((offer.layover_minutes || 0) > 240) {
    penalty += PRICE_PENALTIES.LONG_LAYOVER;
  }
  if (offer.refundable === false) {
    penalty += PRICE_PENALTIES.NON_REFUNDABLE;
  }

  return total * (1 + penalty);
};

// PRD 12.4: Tie-set Selection
const getTieSet = (sortedOffers: Offer[], config: TieSetConfig): Offer[] => {
  if (sortedOffers.length === 0) return [];
  
  const cheapest = sortedOffers[0];
  const tieSet = [cheapest];

  for (let i = 1; i < sortedOffers.length; i++) {
    const o = sortedOffers[i];
    const priceDiff = Math.abs(o.total_price - cheapest.total_price);
    const priceRatio = o.total_price / cheapest.total_price;

    if (priceDiff <= config.priceTieThresholdAbsolute || priceRatio <= config.priceTieThresholdPercent) {
      tieSet.push(o);
    } else {
      break; // Since it's sorted, we can stop early
    }
  }
  return tieSet;
};

// PRD 12.5: Winner Selection (EPC + Trust)
const chooseWinner = (tieSet: Offer[]): Offer | null => {
  if (tieSet.length === 0) return null;

  let best: Offer | null = null;
  let bestScore = -Infinity;

  for (const o of tieSet) {
    const trust = PROVIDER_TRUST_MULTIPLIER[o.provider] || 1.0;
    const score = o.epc * trust;
    
    if (score > bestScore) {
      best = o;
      bestScore = score;
    }
  }
  return best;
};

// PRD 12.6: Guardrails
const applyGuardrails = (recommended: Offer, cheapest: Offer): Offer => {
  if (recommended.total_price > cheapest.total_price * 1.03) {
    return cheapest;
  }
  return recommended;
};

// Transform database row to Offer type
const transformDbOffer = (dbOffer: DatabaseOfferRow): Offer => {
  return {
    id: dbOffer.id,
    provider: dbOffer.provider as ProviderType,
    vertical: dbOffer.vertical as Vertical,
    title: dbOffer.title,
    subtitle: dbOffer.subtitle,
    base_price: Number(dbOffer.base_price),
    taxes_fees: Number(dbOffer.taxes_fees),
    total_price: Number(dbOffer.total_price),
    currency: dbOffer.currency,
    rating: Number(dbOffer.rating),
    reviewCount: dbOffer.review_count,
    image: dbOffer.image || '',
    stops: dbOffer.stops ?? undefined,
    duration: dbOffer.duration ?? undefined,
    layover_minutes: dbOffer.layover_minutes ?? undefined,
    baggage_included: dbOffer.baggage_included ?? undefined,
    carryon_included: dbOffer.carryon_included ?? undefined,
    flight_number: dbOffer.flight_number ?? undefined,
    departure_time: dbOffer.departure_time ?? undefined,
    arrival_time: dbOffer.arrival_time ?? undefined,
    stars: dbOffer.stars ?? undefined,
    amenities: dbOffer.amenities ?? undefined,
    car_type: dbOffer.car_type ?? undefined,
    transmission: dbOffer.transmission ?? undefined,
    passengers: dbOffer.passengers ?? undefined,
    mileage_limit: dbOffer.mileage_limit ?? undefined,
    refundable: dbOffer.refundable ?? undefined,
    epc: Number(dbOffer.epc),
    isCheapest: dbOffer.is_cheapest || false,
    isBestValue: dbOffer.is_best_value || false,
  };
};

export const processOffers = (rawOffers: (Offer | DatabaseOfferRow)[], vertical: Vertical): Offer[] => {
  // 1. Transform database offers to Offer type
  const offers: Offer[] = rawOffers.map((offer): Offer => {
    // If already an Offer, return as-is
    if ('total_price' in offer && typeof offer.total_price === 'number') {
      return offer as Offer;
    }
    // Otherwise, transform from database row
    return transformDbOffer(offer as DatabaseOfferRow);
  });

  // 2. Recompute total prices with penalties
  offers.forEach(o => {
    o.total_price = computeTotalPrice(o);
  });

  // 3. Sort by Cheapest First (PRD 8)
  offers.sort((a, b) => a.total_price - b.total_price);

  if (offers.length === 0) return [];

  // 4. Logic Engine
  const cheapest = offers[0];
  const tieSet = getTieSet(offers, TIE_SET_CONFIG);
  const winner = chooseWinner(tieSet);
  const recommended = winner ? applyGuardrails(winner, cheapest) : cheapest;

  // 5. Tagging
  offers.forEach(o => {
    if (o.id === cheapest.id) o.isCheapest = true;
    if (o.id === recommended.id && recommended.id !== cheapest.id) o.isBestValue = true;
    // Special case: if cheapest is also best value, show Best Value as it implies good deal
    if (o.id === cheapest.id && o.id === recommended.id) o.isBestValue = true; 
  });

  return offers;
};

// Client-side search function (calls API)
export const searchOffers = async (
  vertical: Vertical,
  searchParams?: Partial<import('../types').SearchParams>
): Promise<Offer[]> => {
  try {
    const params = new URLSearchParams();
    params.append('vertical', vertical);

    if (searchParams) {
      if (searchParams.origin) params.append('origin', searchParams.origin);
      if (searchParams.destination) params.append('destination', searchParams.destination);
      if (searchParams.startDate) params.append('startDate', searchParams.startDate);
      if (searchParams.endDate) params.append('endDate', searchParams.endDate);
      if (searchParams.travelers) params.append('travelers', searchParams.travelers.toString());
      if (searchParams.adults) params.append('adults', searchParams.adults.toString());
      if (searchParams.children) params.append('children', searchParams.children.toString());
      if (searchParams.rooms) params.append('rooms', searchParams.rooms.toString());
      if (searchParams.tripType) params.append('tripType', searchParams.tripType);
    }

    const response = await fetch(`/api/search?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch offers');
    }
    const data = await response.json();
    return data.offers || [];
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
};
