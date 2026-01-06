import { Offer, FilterState, SortOption, Vertical } from '@/types';

/**
 * Apply filters to offers
 */
export function applyFilters(offers: Offer[], filters: FilterState, vertical: Vertical): Offer[] {
  let filtered = [...offers];

  // Price range filter
  if (filters.minPrice !== undefined) {
    filtered = filtered.filter(offer => offer.total_price >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter(offer => offer.total_price <= filters.maxPrice!);
  }

  // Vertical-specific filters
  if (vertical === 'flights') {
    // Max stops
    if (filters.maxStops !== undefined) {
      filtered = filtered.filter(offer => (offer.stops || 0) <= filters.maxStops!);
    }

    // Departure time window
    if (filters.departureTimeStart || filters.departureTimeEnd) {
      filtered = filtered.filter(offer => {
        if (!offer.departure_time) return true;
        
        try {
          const timeParts = offer.departure_time.split(':');
          if (timeParts.length !== 2) return true; // Invalid format, include offer
          
          const hours = Number(timeParts[0]);
          const minutes = Number(timeParts[1]);
          if (isNaN(hours) || isNaN(minutes)) return true;
          
          const departureMinutes = hours * 60 + minutes;
          
          if (filters.departureTimeStart) {
            const startParts = filters.departureTimeStart.split(':');
            if (startParts.length === 2) {
              const startHours = Number(startParts[0]);
              const startMinutes = Number(startParts[1]);
              if (!isNaN(startHours) && !isNaN(startMinutes)) {
                const startMinutesTotal = startHours * 60 + startMinutes;
                if (departureMinutes < startMinutesTotal) return false;
              }
            }
          }
          
          if (filters.departureTimeEnd) {
            const endParts = filters.departureTimeEnd.split(':');
            if (endParts.length === 2) {
              const endHours = Number(endParts[0]);
              const endMinutes = Number(endParts[1]);
              if (!isNaN(endHours) && !isNaN(endMinutes)) {
                const endMinutesTotal = endHours * 60 + endMinutes;
                if (departureMinutes > endMinutesTotal) return false;
              }
            }
          }
        } catch (e) {
          // If parsing fails, include the offer
          return true;
        }
        
        return true;
      });
    }

    // Max duration
    if (filters.maxDuration !== undefined) {
      filtered = filtered.filter(offer => {
        if (!offer.duration) return true;
        
        try {
          // Parse duration string like "5h 20m" to minutes
          const durationMatch = offer.duration.match(/(\d+)h\s*(\d+)?m?/);
          if (!durationMatch) return true; // Invalid format, include offer
          
          const hours = parseInt(durationMatch[1] || '0', 10);
          const minutes = parseInt(durationMatch[2] || '0', 10);
          if (isNaN(hours) || isNaN(minutes)) return true;
          
          const totalMinutes = hours * 60 + minutes;
          return totalMinutes <= filters.maxDuration!;
        } catch (e) {
          // If parsing fails, include the offer
          return true;
        }
      });
    }

    // Airlines filter
    if (filters.airlines && filters.airlines.length > 0) {
      filtered = filtered.filter(offer =>
        filters.airlines!.some(airline =>
          offer.subtitle.toLowerCase().includes(airline.toLowerCase())
        )
      );
    }
  }

  if (vertical === 'stays') {
    // Min stars
    if (filters.minStars !== undefined) {
      filtered = filtered.filter(offer => (offer.stars || 0) >= filters.minStars!);
    }

    // Min rating
    if (filters.minRating !== undefined) {
      filtered = filtered.filter(offer => offer.rating >= filters.minRating!);
    }

    // Refundable
    if (filters.refundable !== undefined) {
      filtered = filtered.filter(offer => offer.refundable === filters.refundable);
    }

    // Amenities
    if (filters.amenities && filters.amenities.length > 0) {
      filtered = filtered.filter(offer => {
        if (!offer.amenities || offer.amenities.length === 0) return false;
        return filters.amenities!.some(amenity =>
          offer.amenities!.some(offerAmenity =>
            offerAmenity.toLowerCase().includes(amenity.toLowerCase())
          )
        );
      });
    }
  }

  if (vertical === 'cars') {
    // Car class
    if (filters.carClass && filters.carClass.length > 0) {
      filtered = filtered.filter(offer =>
        offer.car_type && filters.carClass!.some(className =>
          offer.car_type!.toLowerCase().includes(className.toLowerCase())
        )
      );
    }

    // Transmission
    if (filters.transmission && filters.transmission.length > 0) {
      filtered = filtered.filter(offer =>
        offer.transmission && filters.transmission!.includes(offer.transmission)
      );
    }

    // Unlimited mileage
    if (filters.unlimitedMileage !== undefined) {
      filtered = filtered.filter(offer => {
        if (!offer.mileage_limit) return false;
        return offer.mileage_limit.toLowerCase().includes('unlimited');
      });
    }

    // Suppliers
    if (filters.suppliers && filters.suppliers.length > 0) {
      filtered = filtered.filter(offer =>
        filters.suppliers!.some(supplier =>
          offer.subtitle.toLowerCase().includes(supplier.toLowerCase())
        )
      );
    }
  }

  if (vertical === 'things-to-do') {
    // Activity category
    if (filters.activityCategory && filters.activityCategory.length > 0) {
      filtered = filtered.filter(offer =>
        offer.activity_category && filters.activityCategory!.some(category =>
          offer.activity_category!.toLowerCase().includes(category.toLowerCase())
        )
      );
    }

    // Min rating
    if (filters.minRating !== undefined) {
      filtered = filtered.filter(offer => offer.rating >= filters.minRating!);
    }

    // Refundable
    if (filters.refundable !== undefined) {
      filtered = filtered.filter(offer => offer.refundable === filters.refundable);
    }

    // Duration filter
    if (filters.activityDuration && filters.activityDuration.length > 0) {
      filtered = filtered.filter(offer => {
        if (!offer.activity_duration) return true;
        const duration = offer.activity_duration.toLowerCase();
        return filters.activityDuration!.some(filterDuration => {
          if (filterDuration === 'short' && (duration.includes('hour') || duration.includes('1h'))) return true;
          if (filterDuration === 'half-day' && (duration.includes('half') || duration.includes('4h'))) return true;
          if (filterDuration === 'full-day' && (duration.includes('full') || duration.includes('day'))) return true;
          return duration.includes(filterDuration.toLowerCase());
        });
      });
    }
  }

  if (vertical === 'cruises') {
    // Cruise Lines
    if (filters.cruiseLines && filters.cruiseLines.length > 0) {
      filtered = filtered.filter(offer => {
        const cruiseOffer = offer as any;
        return cruiseOffer.cruise_line && filters.cruiseLines!.some(line =>
          cruiseOffer.cruise_line.toLowerCase().includes(line.toLowerCase())
        );
      });
    }

    // Cruise Regions
    if (filters.cruiseRegions && filters.cruiseRegions.length > 0) {
      filtered = filtered.filter(offer => {
        const cruiseOffer = offer as any;
        return cruiseOffer.cruise_region && filters.cruiseRegions!.some(region =>
          cruiseOffer.cruise_region.toLowerCase().includes(region.toLowerCase())
        );
      });
    }

    // Cruise Duration (nights)
    if (filters.cruiseDurationMin !== undefined || filters.cruiseDurationMax !== undefined) {
      filtered = filtered.filter(offer => {
        const cruiseOffer = offer as any;
        if (!cruiseOffer.cruise_duration) return true;
        const nights = cruiseOffer.cruise_duration;
        if (filters.cruiseDurationMin !== undefined && nights < filters.cruiseDurationMin) return false;
        if (filters.cruiseDurationMax !== undefined && nights > filters.cruiseDurationMax) return false;
        return true;
      });
    }

    // Cabin Type
    if (filters.cruiseCabinType && filters.cruiseCabinType.length > 0) {
      filtered = filtered.filter(offer => {
        const cruiseOffer = offer as any;
        return cruiseOffer.cruise_cabin_type && filters.cruiseCabinType!.includes(cruiseOffer.cruise_cabin_type);
      });
    }

    // Departure Port
    if (filters.cruiseDeparturePort && filters.cruiseDeparturePort.length > 0) {
      filtered = filtered.filter(offer => {
        const cruiseOffer = offer as any;
        return cruiseOffer.cruise_departure_port && filters.cruiseDeparturePort!.some(port =>
          cruiseOffer.cruise_departure_port.toLowerCase().includes(port.toLowerCase())
        );
      });
    }

    // Min rating
    if (filters.minRating !== undefined) {
      filtered = filtered.filter(offer => offer.rating >= filters.minRating!);
    }

    // Refundable
    if (filters.refundable !== undefined) {
      filtered = filtered.filter(offer => offer.refundable === filters.refundable);
    }
  }

  return filtered;
}

/**
 * Sort offers based on sort option
 */
export function sortOffers(offers: Offer[], sortBy: SortOption): Offer[] {
  const sorted = [...offers];

  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.total_price - b.total_price);

    case 'price-desc':
      return sorted.sort((a, b) => b.total_price - a.total_price);

    case 'rating-desc':
      return sorted.sort((a, b) => {
        // First by rating, then by review count
        if (b.rating !== a.rating) {
          return b.rating - a.rating;
        }
        return b.reviewCount - a.reviewCount;
      });

    case 'duration-asc':
      return sorted.sort((a, b) => {
        if (!a.duration || !b.duration) return 0;
        const aMinutes = parseDurationToMinutes(a.duration);
        const bMinutes = parseDurationToMinutes(b.duration);
        return aMinutes - bMinutes;
      });

    case 'duration-desc':
      return sorted.sort((a, b) => {
        if (!a.duration || !b.duration) return 0;
        const aMinutes = parseDurationToMinutes(a.duration);
        const bMinutes = parseDurationToMinutes(b.duration);
        return bMinutes - aMinutes;
      });

    case 'recommended':
    default:
      // Recommended: cheapest first, but respect isBestValue flag
      return sorted.sort((a, b) => {
        // Best value offers first
        if (a.isBestValue && !b.isBestValue) return -1;
        if (!a.isBestValue && b.isBestValue) return 1;
        // Then cheapest
        if (a.isCheapest && !b.isCheapest) return -1;
        if (!a.isCheapest && b.isCheapest) return 1;
        // Then by price
        return a.total_price - b.total_price;
      });
  }
}

/**
 * Parse duration string to minutes
 * Examples: "5h 20m" -> 320, "2h" -> 120, "45m" -> 45
 */
function parseDurationToMinutes(duration: string): number {
  const hoursMatch = duration.match(/(\d+)h/);
  const minutesMatch = duration.match(/(\d+)m/);
  
  const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
  const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;
  
  return hours * 60 + minutes;
}

/**
 * Apply both filters and sorting
 */
export function filterAndSortOffers(
  offers: Offer[],
  filters: FilterState,
  sortBy: SortOption,
  vertical: Vertical
): Offer[] {
  const filtered = applyFilters(offers, filters, vertical);
  return sortOffers(filtered, sortBy);
}

