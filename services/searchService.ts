import { Offer, Vertical, TieSetConfig } from '../types';
import { PROVIDER_TRUST_MULTIPLIER, TIE_SET_CONFIG, MOCK_FLIGHT_OFFERS, MOCK_STAY_OFFERS, MOCK_CAR_OFFERS } from '../constants';

// PRD 12.3: Total Price Calculation
const computeTotalPrice = (offer: Partial<Offer>): number => {
  let total = (offer.base_price || 0) + (offer.taxes_fees || 0);
  let penalty = 0;

  // Anti-Fake-Cheap logic from PRD
  if (offer.baggage_included === undefined || offer.baggage_included === false) penalty += 0.03;
  if (offer.carryon_included === false) penalty += 0.02;
  if ((offer.layover_minutes || 0) > 240) penalty += 0.01;
  if (offer.refundable === false) penalty += 0.005;

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

export const processOffers = (rawOffers: any[], vertical: Vertical): Offer[] => {
  // 1. Normalize and compute total price
  const offers: Offer[] = rawOffers.map((o) => {
    const total = computeTotalPrice(o);
    const image = vertical === 'flights' 
      ? `https://picsum.photos/seed/${o.subtitle.replace(/\s/g, '')}/64/64`
      : vertical === 'cars'
      ? `https://picsum.photos/seed/${o.title.replace(/\s/g, '')}car/300/200`
      : `https://picsum.photos/seed/${o.id}/300/200`;
      
    return {
      ...o,
      vertical,
      total_price: total,
      currency: 'USD',
      image
    };
  });

  // 2. Sort by Cheapest First (PRD 8)
  offers.sort((a, b) => a.total_price - b.total_price);

  if (offers.length === 0) return [];

  // 3. Logic Engine
  const cheapest = offers[0];
  const tieSet = getTieSet(offers, TIE_SET_CONFIG);
  const winner = chooseWinner(tieSet);
  const recommended = winner ? applyGuardrails(winner, cheapest) : cheapest;

  // 4. Tagging
  offers.forEach(o => {
    if (o.id === cheapest.id) o.isCheapest = true;
    if (o.id === recommended.id && recommended.id !== cheapest.id) o.isBestValue = true;
    // Special case: if cheapest is also best value, show Best Value as it implies good deal
    if (o.id === cheapest.id && o.id === recommended.id) o.isBestValue = true; 
  });

  return offers;
};

export const searchOffers = async (vertical: Vertical): Promise<Offer[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  if (vertical === 'flights') {
    return processOffers(MOCK_FLIGHT_OFFERS, vertical);
  } else if (vertical === 'stays') {
    return processOffers(MOCK_STAY_OFFERS, vertical);
  } else if (vertical === 'cars') {
    return processOffers(MOCK_CAR_OFFERS, vertical);
  }
  
  return [];
};