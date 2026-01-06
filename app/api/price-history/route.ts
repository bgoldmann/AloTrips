import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Vertical } from '@/types';

/**
 * Price History API
 * 
 * GET /api/price-history - Get price history for a destination/route
 * POST /api/price-history - Record a price snapshot (called by search API)
 */

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;
    
    const destination = searchParams.get('destination');
    const vertical = searchParams.get('vertical') as Vertical | null;
    const origin = searchParams.get('origin');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const days = parseInt(searchParams.get('days') || '30', 10); // Default 30 days

    if (!destination) {
      return NextResponse.json(
        { error: 'Destination is required' },
        { status: 400 }
      );
    }

    // Build query
    let query = supabase
      .from('price_history')
      .select('*')
      .eq('destination', destination)
      .gte('recorded_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('recorded_at', { ascending: false });

    if (vertical) {
      query = query.eq('vertical', vertical);
    }

    if (origin) {
      query = query.eq('origin', origin);
    }

    if (startDate) {
      query = query.eq('start_date', startDate);
    }

    if (endDate) {
      query = query.eq('end_date', endDate);
    }

    const { data, error } = await query.limit(1000); // Limit to prevent huge responses

    if (error) {
      console.error('Error fetching price history:', error);
      return NextResponse.json(
        { error: 'Failed to fetch price history' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      history: data || [],
      count: data?.length || 0 
    });
  } catch (error) {
    console.error('Price history API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    const {
      offerId,
      provider,
      vertical,
      origin,
      destination,
      startDate,
      endDate,
      travelers,
      basePrice,
      taxesFees,
      totalPrice,
      currency,
      offerMetadata,
    } = body;

    // Validate required fields
    if (!offerId || !provider || !vertical || !destination || !totalPrice) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert price history record
    const { data, error } = await supabase
      .from('price_history')
      .insert({
        offer_id: offerId,
        provider,
        vertical,
        origin: origin || null,
        destination,
        start_date: startDate || null,
        end_date: endDate || null,
        travelers: travelers || 2,
        base_price: basePrice || 0,
        taxes_fees: taxesFees || 0,
        total_price: totalPrice,
        currency: currency || 'USD',
        offer_metadata: offerMetadata || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error recording price history:', error);
      return NextResponse.json(
        { error: 'Failed to record price history' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, record: data });
  } catch (error) {
    console.error('Price history POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

