import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sanitizeString } from '@/lib/utils/sanitize';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || 'u_12345'; // Default for demo

    const { data: trips, error } = await supabase
      .from('saved_trips')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch saved trips' },
        { status: 500 }
      );
    }

    return NextResponse.json({ trips: trips || [] });
  } catch (error) {
    console.error('Saved trips API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId = 'u_12345',
      name,
      vertical,
      searchParams: searchParamsData,
      flightSegments,
      flexibleDays = 0,
      notes,
      tags,
      isFavorite = false,
    } = body;

    // Validate required fields
    if (!name || !vertical || !searchParamsData) {
      return NextResponse.json(
        { error: 'Missing required fields: name, vertical, searchParams' },
        { status: 400 }
      );
    }

    // Sanitize input
    const sanitizedName = sanitizeString(name);
    const sanitizedNotes = notes ? sanitizeString(notes) : null;

    const supabase = await createClient();

    const { data, error } = await (supabase
      .from('saved_trips') as any)
      .insert({
        user_id: userId,
        name: sanitizedName,
        vertical,
        search_params: searchParamsData,
        flight_segments: flightSegments || null,
        flexible_days: flexibleDays || 0,
        notes: sanitizedNotes,
        tags: tags || [],
        is_favorite: isFavorite,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to save trip' },
        { status: 500 }
      );
    }

    return NextResponse.json({ trip: data });
  } catch (error) {
    console.error('Save trip API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, notes, tags, isFavorite } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Missing required field: id' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const updateData: any = {};
    if (name !== undefined) updateData.name = sanitizeString(name);
    if (notes !== undefined) updateData.notes = notes ? sanitizeString(notes) : null;
    if (tags !== undefined) updateData.tags = tags;
    if (isFavorite !== undefined) updateData.is_favorite = isFavorite;

    const { data, error } = await (supabase
      .from('saved_trips') as any)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to update trip' },
        { status: 500 }
      );
    }

    return NextResponse.json({ trip: data });
  } catch (error) {
    console.error('Update trip API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Missing required parameter: id' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { error } = await (supabase
      .from('saved_trips') as any)
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to delete trip' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete trip API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

