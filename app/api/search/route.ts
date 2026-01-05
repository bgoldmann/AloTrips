import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { processOffers } from '@/services/searchService';
import { Vertical } from '@/types';

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

    const supabase = await createClient();

    // Fetch offers from Supabase
    const { data: offers, error } = await supabase
      .from('offers')
      .select('*')
      .eq('vertical', vertical)
      .order('total_price', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch offers' },
        { status: 500 }
      );
    }

    if (!offers || offers.length === 0) {
      return NextResponse.json({ offers: [] });
    }

    // Process offers through the decision engine
    const processedOffers = processOffers(offers, vertical);

    // Update offers in database with cheapest/best value flags
    for (const offer of processedOffers) {
      await supabase
        .from('offers')
        .update({
          is_cheapest: offer.isCheapest || false,
          is_best_value: offer.isBestValue || false,
          total_price: offer.total_price,
        })
        .eq('id', offer.id);
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

