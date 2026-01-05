import { Vertical, SearchParams, Offer } from '@/types';

export type UpsellType = 'esim' | 'insurance' | 'bundle' | null;

export interface UpsellRecommendation {
  type: UpsellType;
  priority: number; // Higher = more important
  message?: string;
  reason?: string;
}

export interface TripContext {
  vertical: Vertical;
  searchParams: SearchParams;
  offers: Offer[];
  destination?: string;
  origin?: string;
  isInternational?: boolean;
  tripDuration?: number; // in days
  totalTripValue?: number; // estimated total cost
}

/**
 * Check if a trip is international
 * Based on PRD Section 10.1
 */
export function isInternationalTrip(origin?: string, destination?: string): boolean {
  if (!origin || !destination) return false;
  
  // Simple heuristic: if origin and destination contain different country indicators
  // In production, this would use a geocoding service
  const originLower = origin.toLowerCase();
  const destinationLower = destination.toLowerCase();
  
  // US cities/airports
  const usIndicators = ['nyc', 'new york', 'lax', 'los angeles', 'sfo', 'san francisco', 'miami', 'chicago', 'boston', 'atlanta', 'dallas', 'houston', 'philadelphia', 'phoenix', 'seattle', 'denver', 'washington', 'dc'];
  const originIsUS = usIndicators.some(indicator => originLower.includes(indicator));
  const destIsUS = usIndicators.some(indicator => destinationLower.includes(indicator));
  
  // If one is US and the other isn't, it's international
  if (originIsUS && !destIsUS) return true;
  if (!originIsUS && destIsUS) return true;
  
  // If neither looks like US, assume international (conservative)
  if (!originIsUS && !destIsUS) return true;
  
  return false;
}

/**
 * Calculate trip duration in days
 */
export function calculateTripDuration(startDate: string, endDate?: string): number {
  if (!endDate) return 1; // One-way trip, assume 1 day
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(1, diffDays);
}

/**
 * Estimate total trip value from offers
 */
export function estimateTripValue(offers: Offer[]): number {
  if (offers.length === 0) return 0;
  
  // Use the cheapest offer as baseline, or average if multiple
  const prices = offers.map(o => o.total_price).filter(p => p > 0);
  if (prices.length === 0) return 0;
  
  return Math.min(...prices); // Use cheapest as conservative estimate
}

/**
 * Determine if trip is expensive (for insurance recommendation)
 * Based on PRD Section 10.2
 */
export function isExpensiveTrip(totalValue: number): boolean {
  // Consider trip expensive if > $500
  return totalValue > 500;
}

/**
 * Check if flight has multiple legs (for insurance recommendation)
 */
export function hasMultipleLegs(offers: Offer[]): boolean {
  if (offers.length === 0) return false;
  
  // Check if any flight has stops
  return offers.some(offer => 
    offer.vertical === 'flights' && 
    (offer.stops !== undefined && offer.stops > 0)
  );
}

/**
 * Get eSIM recommendation based on trip context
 * Based on PRD Section 10.1
 */
export function getEsimRecommendation(context: TripContext): UpsellRecommendation | null {
  const { searchParams, isInternational, tripDuration } = context;
  
  // Only recommend eSIM for international trips
  if (!isInternational) return null;
  
  // Duration-based recommendations
  if (tripDuration && tripDuration >= 1) {
    if (tripDuration <= 3) {
      return {
        type: 'esim',
        priority: 3,
        message: 'Get an eSIM for your trip starting at $4.50',
        reason: 'Short trip - perfect for a 3-day plan',
      };
    } else if (tripDuration <= 10) {
      return {
        type: 'esim',
        priority: 4,
        message: 'Stay connected abroad with an eSIM from $8.99',
        reason: 'Medium trip - ideal for a 7-10 day plan',
      };
    } else {
      return {
        type: 'esim',
        priority: 5,
        message: 'Don\'t roam alone! Get an eSIM for your extended trip',
        reason: 'Long trip - save on roaming with a monthly plan',
      };
    }
  }
  
  // Default recommendation
  return {
    type: 'esim',
    priority: 3,
    message: 'Get an eSIM for your trip starting at $4.50',
    reason: 'International trip detected',
  };
}

/**
 * Get insurance recommendation based on trip context
 * Based on PRD Section 10.2
 */
export function getInsuranceRecommendation(context: TripContext): UpsellRecommendation | null {
  const { isInternational, tripDuration, totalTripValue, offers } = context;
  
  // Insurance is relevant for:
  // 1. International trips
  // 2. Expensive trips (>$500)
  // 3. Multi-leg flights
  // 4. Longer trips (7+ days)
  
  const shouldRecommend = 
    isInternational || 
    isExpensiveTrip(totalTripValue || 0) || 
    hasMultipleLegs(offers) ||
    (tripDuration && tripDuration >= 7);
  
  if (!shouldRecommend) return null;
  
  // Duration-based emphasis
  if (tripDuration && tripDuration >= 7) {
    return {
      type: 'insurance',
      priority: 5,
      message: 'Protect your extended trip - Medical & cancellation coverage from $12',
      reason: 'Long trip - medical coverage recommended',
    };
  } else {
    return {
      type: 'insurance',
      priority: 4,
      message: 'Protect your trip - Medical & cancellation coverage from $12',
      reason: 'Trip protection recommended',
    };
  }
}

/**
 * Get bundle recommendation (eSIM + Insurance)
 * Based on PRD Section 10.3
 */
export function getBundleRecommendation(context: TripContext): UpsellRecommendation | null {
  const esimRec = getEsimRecommendation(context);
  const insuranceRec = getInsuranceRecommendation(context);
  
  // Only recommend bundle if both are relevant
  if (!esimRec || !insuranceRec) return null;
  
  // Bundle is higher priority if both are recommended
  const bundlePriority = Math.max(esimRec.priority, insuranceRec.priority) + 1;
  
  return {
    type: 'bundle',
    priority: bundlePriority,
    message: 'Bundle & Save: eSIM + Travel Insurance',
    reason: 'Both eSIM and insurance recommended for your trip',
  };
}

/**
 * Get the best upsell recommendation for a trip
 * Based on PRD Section 10
 */
export function getUpsellRecommendation(context: TripContext): UpsellRecommendation | null {
  // Calculate trip context
  const tripDuration = calculateTripDuration(
    context.searchParams.startDate,
    context.searchParams.endDate
  );
  const totalTripValue = estimateTripValue(context.offers);
  const isInternational = isInternationalTrip(
    context.origin || context.searchParams.origin,
    context.destination || context.searchParams.destination
  );
  
  const fullContext: TripContext = {
    ...context,
    tripDuration,
    totalTripValue,
    isInternational,
  };
  
  // Get all recommendations
  const bundleRec = getBundleRecommendation(fullContext);
  const esimRec = getEsimRecommendation(fullContext);
  const insuranceRec = getInsuranceRecommendation(fullContext);
  
  // Return highest priority recommendation
  const recommendations = [bundleRec, esimRec, insuranceRec].filter(
    (rec): rec is UpsellRecommendation => rec !== null
  );
  
  if (recommendations.length === 0) return null;
  
  // Sort by priority (highest first)
  recommendations.sort((a, b) => b.priority - a.priority);
  
  return recommendations[0];
}

