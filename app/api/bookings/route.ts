import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || 'u_12345'; // Default for demo

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch bookings' },
        { status: 500 }
      );
    }

    // Transform to match Booking type
    const transformedBookings = bookings?.map((booking) => ({
      id: booking.id,
      date: booking.date,
      itemTitle: booking.item_title,
      type: booking.type as 'Flight' | 'Hotel' | 'Car',
      status: booking.status as 'Confirmed' | 'Pending' | 'Cancelled',
      amount: Number(booking.amount),
      currency: booking.currency,
      provider: booking.provider,
      customerName: booking.customer_name,
    })) || [];

    return NextResponse.json({ bookings: transformedBookings });
  } catch (error) {
    console.error('Bookings API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

