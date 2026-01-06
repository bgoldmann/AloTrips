import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkAdminAccess, requireAdmin } from '@/lib/auth/admin';

/**
 * GET /api/admin/bookings
 * Get all bookings with pagination, filtering, and search
 */
export async function GET(request: NextRequest) {
  try {
    // Check admin access
    const authError = await checkAdminAccess();
    if (authError) return authError;

    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    const supabase = admin.supabase;
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50', 10) || 50));
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const provider = searchParams.get('provider') || '';

    let query = supabase
      .from('bookings')
      .select('*', { count: 'exact' })
      .order('date', { ascending: false });

    // Apply search filter
    if (search) {
      query = query.or(`item_title.ilike.%${search}%,customer_name.ilike.%${search}%,id.ilike.%${search}%`);
    }

    // Apply status filter
    if (status) {
      query = query.eq('status', status);
    }

    // Apply provider filter
    if (provider) {
      query = query.eq('provider', provider);
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: bookings, count, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch bookings' },
        { status: 500 }
      );
    }

    // Transform to match Booking type
    const transformedBookings = bookings?.map((booking: any) => ({
      id: booking.id,
      date: booking.date,
      itemTitle: booking.item_title,
      type: booking.type as 'Flight' | 'Hotel' | 'Car',
      status: booking.status as 'Confirmed' | 'Pending' | 'Cancelled',
      amount: Number(booking.amount),
      currency: booking.currency,
      provider: booking.provider,
      customerName: booking.customer_name,
      userId: booking.user_id,
    })) || [];

    return NextResponse.json({
      bookings: transformedBookings,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Bookings API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/bookings/[id]
 * Update booking status
 */
export async function PUT(request: NextRequest) {
  try {
    // Check admin access
    const authError = await checkAdminAccess();
    if (authError) return authError;

    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Booking ID and status are required' },
        { status: 400 }
      );
    }

    // Validate status value
    if (!['Confirmed', 'Pending', 'Cancelled'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    const supabase = admin.supabase;

    const updateData = {
      status,
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to update booking' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, booking: data });
  } catch (error) {
    console.error('Update booking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

