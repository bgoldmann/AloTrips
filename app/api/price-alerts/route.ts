import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Vertical } from '@/types';

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
    const status = searchParams.get('status'); // active, triggered, cancelled, expired
    const vertical = searchParams.get('vertical') as Vertical | null;

    // Build query
    let query = supabase
      .from('price_alerts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    if (vertical) {
      query = query.eq('vertical', vertical);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching price alerts:', error);
      return NextResponse.json(
        { error: 'Failed to fetch price alerts' },
        { status: 500 }
      );
    }

    return NextResponse.json({ alerts: data || [] });
  } catch (error) {
    console.error('Price alerts API error:', error);
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
    const { 
      vertical, 
      origin, 
      destination, 
      startDate, 
      endDate, 
      targetPrice, 
      searchParams,
      expiresAt 
    } = body;

    if (!vertical || !destination) {
      return NextResponse.json(
        { error: 'Missing required fields: vertical, destination' },
        { status: 400 }
      );
    }

    // Check if similar alert already exists
    const { data: existing } = await supabase
      .from('price_alerts')
      .select('id')
      .eq('user_id', user.id)
      .eq('vertical', vertical)
      .eq('destination', destination)
      .eq('status', 'active')
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Price alert already exists for this destination' },
        { status: 409 }
      );
    }

    // Insert new price alert
    const { data, error } = await supabase
      .from('price_alerts')
      .insert({
        user_id: user.id,
        vertical,
        origin: origin || null,
        destination,
        start_date: startDate || null,
        end_date: endDate || null,
        target_price: targetPrice || null,
        current_price: null,
        lowest_price: null,
        status: 'active',
        expires_at: expiresAt || null,
        search_params: searchParams || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating price alert:', error);
      return NextResponse.json(
        { error: 'Failed to create price alert' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, alert: data });
  } catch (error) {
    console.error('Price alerts POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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
    const { id, targetPrice, status: newStatus } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Missing alert id' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (targetPrice !== undefined) updateData.target_price = targetPrice;
    if (newStatus) updateData.status = newStatus;

    const { data, error } = await supabase
      .from('price_alerts')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating price alert:', error);
      return NextResponse.json(
        { error: 'Failed to update price alert' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, alert: data });
  } catch (error) {
    console.error('Price alerts PUT error:', error);
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
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Missing alert id parameter' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('price_alerts')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting price alert:', error);
      return NextResponse.json(
        { error: 'Failed to delete price alert' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Price alerts DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

