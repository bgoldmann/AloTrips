import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { processOffers } from '@/services/searchService';
import { Vertical, SearchParams, Offer, ProviderType } from '@/types';
import { initializeProviders, getProviderConfigsFromEnv, getAggregator } from '@/lib/providers';
import { generatePackages, PackageOffer } from '@/lib/packages/bundler';
import { PackageSearchApiResponse, SearchApiResponse } from '@/types/api';
import { DatabaseOfferRow } from '@/types/database';
import { logApiError } from '@/lib/errors/logger';
import { sanitizeSearchParams } from '@/lib/utils/sanitize';
import { getNearbyAirports } from '@/lib/nearby-airports';

// Initialize providers on module load (lazy initialization would be better for serverless)
let providersInitialized = false;
function ensureProvidersInitialized() {
  if (!providersInitialized) {
    const providerConfigs = getProviderConfigsFromEnv();
    initializeProviders(providerConfigs);
    providersInitialized = true;
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const vertical = searchParams.get('vertical') as Vertical;

    if (!vertical || !['stays', 'flights', 'cars', 'packages', 'cruises', 'things-to-do'].includes(vertical)) {
      return NextResponse.json(
        { error: 'Invalid vertical parameter' },
        { status: 400 }
      );
    }

    // Extract and sanitize search parameters from query string
    const rawSearchParams: SearchParams = {
      origin: searchParams.get('origin') || undefined,
      destination: searchParams.get('destination') || 'New York',
      startDate: searchParams.get('startDate') || new Date().toISOString().split('T')[0],
      endDate: searchParams.get('endDate') || undefined,
      travelers: parseInt(searchParams.get('travelers') || '2', 10),
      adults: searchParams.get('adults') ? parseInt(searchParams.get('adults')!, 10) : undefined,
      children: searchParams.get('children') ? parseInt(searchParams.get('children')!, 10) : undefined,
      rooms: searchParams.get('rooms') ? parseInt(searchParams.get('rooms')!, 10) : undefined,
      tripType: searchParams.get('tripType') as SearchParams['tripType'] || undefined,
      flexibleDays: searchParams.get('flexibleDays') ? parseInt(searchParams.get('flexibleDays')!, 10) : undefined,
      flightSegments: searchParams.get('flightSegments') ? JSON.parse(searchParams.get('flightSegments')!) : undefined,
      includeNearbyAirports: searchParams.get('includeNearbyAirports') === 'true',
    };
    
    // Sanitize input to prevent XSS attacks
    const searchParamsObj: SearchParams = sanitizeSearchParams(rawSearchParams) as SearchParams;

    ensureProvidersInitialized();
    const aggregator = getAggregator();
    let allOffers: Offer[] = [];

    // Handle packages vertical specially - bundle flights, hotels, and cars
    if (vertical === 'packages') {
      // Search for flights, hotels, and cars separately
      const flights: Offer[] = [];
      const hotels: Offer[] = [];
      const cars: Offer[] = [];

      // Search flights
      try {
        const flightResponses = await aggregator.search('flights', searchParamsObj, {
          timeout: 10000,
          useCache: true,
        });
        for (const response of flightResponses) {
          if (response.data && response.data.length > 0) {
            flights.push(...response.data);
          }
        }
      } catch (e) {
        console.error('Flight search error:', e);
      }

      // Search hotels
      try {
        const hotelResponses = await aggregator.search('stays', searchParamsObj, {
          timeout: 10000,
          useCache: true,
        });
        for (const response of hotelResponses) {
          if (response.data && response.data.length > 0) {
            hotels.push(...response.data);
          }
        }
      } catch (e) {
        console.error('Hotel search error:', e);
      }

      // Search cars
      try {
        const carResponses = await aggregator.search('cars', searchParamsObj, {
          timeout: 10000,
          useCache: true,
        });
        for (const response of carResponses) {
          if (response.data && response.data.length > 0) {
            cars.push(...response.data);
          }
        }
      } catch (e) {
        console.error('Car search error:', e);
      }

      // Process individual offers
      const processedFlights = await processOffers(flights, 'flights');
      const processedHotels = await processOffers(hotels, 'stays');
      const processedCars = await processOffers(cars, 'cars');

      // Generate packages
      const packages = generatePackages(
        processedFlights,
        processedHotels,
        processedCars,
        searchParamsObj
      );

      // Return packages with proper type
      const response: PackageSearchApiResponse = {
        offers: packages,
        packages: true,
      };
      return NextResponse.json(response);
    }

    // Handle multi-city flights specially
    if (vertical === 'flights' && searchParamsObj.tripType === 'multi-city' && searchParamsObj.flightSegments && searchParamsObj.flightSegments.length > 0) {
      // For multi-city, search each segment and combine results
      const segmentOffers: Offer[][] = [];
      
      for (const segment of searchParamsObj.flightSegments) {
        const segmentParams: SearchParams = {
          ...searchParamsObj,
          origin: segment.origin,
          destination: segment.destination,
          // Use segment date if available, otherwise use main dates
          startDate: typeof segment.date === 'string' ? segment.date : (segment.date instanceof Date ? segment.date.toISOString().split('T')[0] : searchParamsObj.startDate),
        };
        
        try {
          const segmentResponses = await aggregator.search(vertical, segmentParams, {
            timeout: 10000,
            useCache: true,
          });
          
          const segmentResults: Offer[] = [];
          for (const response of segmentResponses) {
            if (response.data && response.data.length > 0) {
              segmentResults.push(...response.data);
            }
          }
          segmentOffers.push(segmentResults);
        } catch (error) {
          console.error(`Error searching segment ${segment.origin} to ${segment.destination}:`, error);
          segmentOffers.push([]);
        }
      }
      
      // Combine segments (for now, take top offers from each segment)
      // In a full implementation, you'd create multi-city itineraries
      if (segmentOffers.length > 0) {
        // For simplicity, return offers from first segment
        // A full implementation would create all possible combinations
        allOffers.push(...segmentOffers[0]);
      }
    } else {
      // Handle nearby airports for flights
      let searchQueries: SearchParams[] = [searchParamsObj];
      
      if (vertical === 'flights' && searchParamsObj.includeNearbyAirports) {
        const nearbyOriginAirports = searchParamsObj.origin 
          ? getNearbyAirports(searchParamsObj.origin)
          : [];
        const nearbyDestAirports = searchParamsObj.destination
          ? getNearbyAirports(searchParamsObj.destination)
          : [];
        
        // Generate search queries for all combinations of nearby airports
        if (nearbyOriginAirports.length > 1 || nearbyDestAirports.length > 1) {
          searchQueries = [];
          const origins = nearbyOriginAirports.length > 0 ? nearbyOriginAirports : [searchParamsObj.origin];
          const destinations = nearbyDestAirports.length > 0 ? nearbyDestAirports : [searchParamsObj.destination];
          
          for (const orig of origins) {
            for (const dest of destinations) {
              searchQueries.push({
                ...searchParamsObj,
                origin: orig,
                destination: dest,
              });
            }
          }
        }
      }
      
      // Try to fetch from providers first
      try {
        // Search all query combinations
        for (const query of searchQueries) {
          const providerResponses = await aggregator.search(vertical, query, {
            timeout: 10000,
            useCache: true,
          });

          // Aggregate offers from all providers
          for (const response of providerResponses) {
            if (response.data && response.data.length > 0) {
              // Tag offers with their origin/destination airports for display
              const taggedOffers = response.data.map(offer => ({
                ...offer,
                searchOrigin: query.origin,
                searchDestination: query.destination,
              }));
              allOffers.push(...taggedOffers);
            }
          }
        }
      } catch (providerError) {
      logApiError('/api/search', providerError instanceof Error ? providerError : new Error(String(providerError)), {
        vertical,
        searchParams: {
          destination: searchParamsObj.destination,
          origin: searchParamsObj.origin,
        },
      });
      // Continue to fallback to Supabase
    }

    // Fallback to Supabase if no provider offers or as additional source
    const supabase = await createClient();
    const { data: dbOffers, error: dbError } = await supabase
      .from('offers')
      .select('*')
      .eq('vertical', vertical)
      .order('total_price', { ascending: true });

    if (!dbError && dbOffers && dbOffers.length > 0) {
      // Transform database offers to Offer format
      const transformedDbOffers: Offer[] = dbOffers.map((dbOffer: DatabaseOfferRow): Offer => ({
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
        refundable: dbOffer.refundable ?? false,
        epc: Number(dbOffer.epc),
        isCheapest: false,
        isBestValue: false,
      }));

      // Merge provider offers with database offers (avoid duplicates by ID)
      const existingIds = new Set(allOffers.map(o => o.id));
      const uniqueDbOffers: Offer[] = transformedDbOffers.filter((o) => !existingIds.has(o.id));
      allOffers.push(...uniqueDbOffers);
    }

    // If no offers from any source, return empty
    if (allOffers.length === 0) {
      return NextResponse.json({ offers: [] });
    }

    // Get user tier for member pricing
    let userTier: 'Silver' | 'Gold' | 'Platinum' | null = null;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userData } = await supabase
          .from('users')
          .select('tier')
          .eq('id', user.id)
          .single();
        if (userData?.tier) {
          userTier = userData.tier as 'Silver' | 'Gold' | 'Platinum';
        }
      }
    } catch (error) {
      // Silently fail - user might not be logged in
    }

    // Apply member pricing if user tier qualifies
    const tierHierarchy = { Silver: 1, Gold: 2, Platinum: 3 };
    if (userTier) {
      allOffers.forEach(offer => {
        if (offer.member_price && offer.member_tier_required) {
          const userTierLevel = tierHierarchy[userTier];
          const requiredTierLevel = tierHierarchy[offer.member_tier_required];
          if (userTierLevel >= requiredTierLevel) {
            // User qualifies for member price - store original for display
            const originalTotal = offer.total_price;
            offer.total_price = offer.member_price;
            // Store original price for display
            (offer as any).original_price = originalTotal;
            (offer as any).is_member_deal = true;
          }
        }
      });
    }

    // Process offers through the decision engine
    const processedOffers = await processOffers(allOffers, vertical);

    // Record price history for processed offers (async, don't wait)
    if (processedOffers.length > 0) {
      // Record price history in background (limit to top 10 to avoid too many writes)
      Promise.all(
        processedOffers.slice(0, 10).map(offer =>
          fetch(`${request.nextUrl.origin}/api/price-history`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              offerId: offer.id,
              provider: offer.provider,
              vertical: offer.vertical,
              origin: searchParamsObj.origin,
              destination: searchParamsObj.destination,
              startDate: searchParamsObj.startDate,
              endDate: searchParamsObj.endDate,
              travelers: searchParamsObj.travelers || 2,
              basePrice: offer.base_price,
              taxesFees: offer.taxes_fees,
              totalPrice: offer.total_price,
              currency: offer.currency,
              offerMetadata: {
                title: offer.title,
                subtitle: offer.subtitle,
                rating: offer.rating,
                reviewCount: offer.reviewCount,
              },
            }),
          }).catch(() => {
            // Silently fail - price history is not critical
          })
        )
      ).catch(() => {
        // Silently fail
      });
    }

    // Optionally save new provider offers to database for caching
    // (This is optional - you can skip this if you prefer to always fetch fresh)
    if (processedOffers.length > 0) {
      // Save to database for future reference (async, don't wait)
      const upsertData = processedOffers.map(offer => ({
            id: offer.id,
            provider: offer.provider,
            vertical: offer.vertical,
            title: offer.title,
            subtitle: offer.subtitle,
            base_price: offer.base_price,
            taxes_fees: offer.taxes_fees,
            total_price: offer.total_price,
            currency: offer.currency,
            rating: offer.rating,
            review_count: offer.reviewCount,
            image: offer.image,
            stops: offer.stops,
            duration: offer.duration,
            layover_minutes: offer.layover_minutes,
            baggage_included: offer.baggage_included,
            carryon_included: offer.carryon_included,
            flight_number: offer.flight_number,
            departure_time: offer.departure_time,
            arrival_time: offer.arrival_time,
            stars: offer.stars,
            amenities: offer.amenities,
            car_type: offer.car_type,
            transmission: offer.transmission,
            passengers: offer.passengers,
            mileage_limit: offer.mileage_limit,
            refundable: offer.refundable,
            epc: offer.epc,
            is_cheapest: offer.isCheapest || false,
            is_best_value: offer.isBestValue || false,
          }));
      (supabase
        .from('offers') as any)
        .upsert(upsertData, { onConflict: 'id' })
        .then(() => {
          // Silently handle errors
        })
        .catch(() => {
          // Silently handle errors
        });
    }

    return NextResponse.json({ offers: processedOffers });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

