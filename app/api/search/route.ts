import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { processOffers } from '@/services/searchService';
import { Vertical, SearchParams, Offer } from '@/types';
import { initializeProviders, getProviderConfigsFromEnv, getAggregator } from '@/lib/providers';
import { generatePackages, PackageOffer } from '@/lib/packages/bundler';
import { PackageSearchApiResponse, SearchApiResponse } from '@/types/api';
import { DatabaseOfferRow } from '@/types/database';
import { logApiError } from '@/lib/errors/logger';
import { sanitizeSearchParams } from '@/lib/utils/sanitize';

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
    };
    
    // Sanitize input to prevent XSS attacks
    const searchParamsObj = sanitizeSearchParams(rawSearchParams);

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
      const processedFlights = processOffers(flights, 'flights');
      const processedHotels = processOffers(hotels, 'stays');
      const processedCars = processOffers(cars, 'cars');

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

    // Try to fetch from providers first
    try {
      const providerResponses = await aggregator.search(vertical, searchParamsObj, {
        timeout: 10000,
        useCache: true,
      });

      // Aggregate offers from all providers
      for (const response of providerResponses) {
        if (response.data && response.data.length > 0) {
          allOffers.push(...response.data);
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
      const transformedDbOffers = dbOffers.map((dbOffer: DatabaseOfferRow) => ({
        id: dbOffer.id,
        provider: dbOffer.provider,
        vertical: dbOffer.vertical,
        title: dbOffer.title,
        subtitle: dbOffer.subtitle,
        base_price: Number(dbOffer.base_price),
        taxes_fees: Number(dbOffer.taxes_fees),
        total_price: Number(dbOffer.total_price),
        currency: dbOffer.currency,
        rating: Number(dbOffer.rating),
        reviewCount: dbOffer.review_count,
        image: dbOffer.image,
        stops: dbOffer.stops,
        duration: dbOffer.duration,
        layover_minutes: dbOffer.layover_minutes,
        baggage_included: dbOffer.baggage_included,
        carryon_included: dbOffer.carryon_included,
        flight_number: dbOffer.flight_number,
        departure_time: dbOffer.departure_time,
        arrival_time: dbOffer.arrival_time,
        stars: dbOffer.stars,
        amenities: dbOffer.amenities,
        car_type: dbOffer.car_type,
        transmission: dbOffer.transmission,
        passengers: dbOffer.passengers,
        mileage_limit: dbOffer.mileage_limit,
        refundable: dbOffer.refundable,
        epc: Number(dbOffer.epc),
      }));

      // Merge provider offers with database offers (avoid duplicates by ID)
      const existingIds = new Set(allOffers.map(o => o.id));
      const uniqueDbOffers = transformedDbOffers.filter((o: Offer) => !existingIds.has(o.id));
      allOffers.push(...uniqueDbOffers);
    }

    // If no offers from any source, return empty
    if (allOffers.length === 0) {
      return NextResponse.json({ offers: [] });
    }

    // Process offers through the decision engine
    const processedOffers = processOffers(allOffers, vertical);

    // Optionally save new provider offers to database for caching
    // (This is optional - you can skip this if you prefer to always fetch fresh)
    if (processedOffers.length > 0) {
      // Save to database for future reference (async, don't wait)
      supabase
        .from('offers')
        .upsert(
          processedOffers.map(offer => ({
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
          })),
          { onConflict: 'id' }
        )
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

