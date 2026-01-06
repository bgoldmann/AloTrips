import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Get total bookings count
    const { count: totalBookings } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Confirmed');

    // Get total revenue (sum of confirmed bookings)
    const { data: confirmedBookings } = await supabase
      .from('bookings')
      .select('amount')
      .eq('status', 'Confirmed');

    const totalRevenue = confirmedBookings?.reduce(
      (sum, booking: any) => sum + Number(booking?.amount || 0),
      0
    ) || 0;

    // Get active users count
    const { count: activeUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    // Mock revenue history (in production, calculate from actual data)
    const revenueHistory = [
      { date: 'Mon', value: 2400 },
      { date: 'Tue', value: 1398 },
      { date: 'Wed', value: 9800 },
      { date: 'Thu', value: 3908 },
      { date: 'Fri', value: 4800 },
      { date: 'Sat', value: 3800 },
      { date: 'Sun', value: 4300 },
    ];

    const stats = {
      totalRevenue,
      totalBookings: totalBookings || 0,
      activeUsers: activeUsers || 0,
      growth: 12.5, // Mock growth percentage
      revenueHistory,
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Admin stats API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

