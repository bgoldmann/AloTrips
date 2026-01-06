import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get current user from auth session
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch user profile' },
        { status: 500 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Transform to match UserProfile type
    const userData: any = user;
    const profile = {
      id: userData.id,
      firstName: userData.first_name,
      lastName: userData.last_name,
      email: userData.email,
      phone: userData.phone || '',
      avatar: userData.avatar || '',
      homeAirport: userData?.home_airport || '',
      currencyPreference: (userData?.currency_preference || 'USD') as 'USD' | 'EUR',
      memberSince: userData?.member_since || '',
      tier: (userData?.tier || 'Silver') as 'Silver' | 'Gold' | 'Platinum',
      points: userData?.points || 0,
    };

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = await createClient();

    const updateData: any = {
      first_name: body.firstName,
      last_name: body.lastName,
      email: body.email,
      phone: body.phone,
      home_airport: body.homeAirport,
      currency_preference: body.currencyPreference,
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', body.id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

