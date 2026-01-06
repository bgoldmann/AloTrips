import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Offer, Vertical } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const vertical = searchParams.get('vertical') as Vertical | null;
    const offerId = searchParams.get('offer_id');

    // Build query
    let query = supabase
      .from('wishlist')
      .select('*')
      .eq('user_id', user.id)
      .order('saved_at', { ascending: false });

    if (vertical) {
      query = query.eq('vertical', vertical);
    }

    // If checking specific offer, return boolean
    if (offerId) {
      const { data: checkData } = await query.eq('offer_id', offerId).single();
      return NextResponse.json({ inWishlist: !!checkData });
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching wishlist:', error);
      return NextResponse.json(
        { error: 'Failed to fetch wishlist' },
        { status: 500 }
      );
    }

    // Transform data to return offers
    const offers: Offer[] = data?.map((item: any) => ({
      ...item.offer_data,
      id: item.offer_id,
      vertical: item.vertical,
    })) || [];

    return NextResponse.json({ offers });
  } catch (error) {
    console.error('Wishlist API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { offer, vertical } = body;

    if (!offer || !offer.id || !vertical) {
      return NextResponse.json(
        { error: 'Missing required fields: offer, vertical' },
        { status: 400 }
      );
    }

    // Check if already in wishlist
    const { data: existing } = await supabase
      .from('wishlist')
      .select('id')
      .eq('user_id', user.id)
      .eq('offer_id', offer.id)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Offer already in wishlist' },
        { status: 409 }
      );
    }

    // Insert into wishlist
    const { data, error } = await supabase
      .from('wishlist')
      .insert({
        user_id: user.id,
        offer_id: offer.id,
        vertical: vertical,
        offer_data: offer,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving to wishlist:', error);
      return NextResponse.json(
        { error: 'Failed to save to wishlist' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, item: data });
  } catch (error) {
    console.error('Wishlist POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const offerId = searchParams.get('offer_id');

    if (!offerId) {
      return NextResponse.json(
        { error: 'Missing offer_id parameter' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('user_id', user.id)
      .eq('offer_id', offerId);

    if (error) {
      console.error('Error removing from wishlist:', error);
      return NextResponse.json(
        { error: 'Failed to remove from wishlist' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Wishlist DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

