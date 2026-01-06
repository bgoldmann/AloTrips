import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sanitizeString } from '@/lib/utils/sanitize';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;
    const propertyId = searchParams.get('propertyId');

    if (!propertyId) {
      return NextResponse.json(
        { error: 'Missing required parameter: propertyId' },
        { status: 400 }
      );
    }

    const { data: reviews, error } = await supabase
      .from('property_reviews')
      .select('*')
      .eq('property_id', propertyId)
      .order('review_date', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch reviews' },
        { status: 500 }
      );
    }

    // Calculate average rating
    const avgRating = reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length
      : 0;

    return NextResponse.json({
      reviews: reviews || [],
      averageRating: Math.round(avgRating * 10) / 10,
      totalReviews: reviews?.length || 0,
    });
  } catch (error) {
    console.error('Reviews API error:', error);
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
      propertyId,
      userId,
      rating,
      title,
      reviewText,
      reviewerName,
      reviewerLocation,
      verifiedBooking = false,
    } = body;

    if (!propertyId || !rating || !reviewText) {
      return NextResponse.json(
        { error: 'Missing required fields: propertyId, rating, reviewText' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await (supabase
      .from('property_reviews') as any)
      .insert({
        property_id: propertyId,
        user_id: userId || null,
        rating: Number(rating),
        title: title ? sanitizeString(title) : null,
        review_text: sanitizeString(reviewText),
        reviewer_name: reviewerName ? sanitizeString(reviewerName) : null,
        reviewer_location: reviewerLocation ? sanitizeString(reviewerLocation) : null,
        verified_booking: verifiedBooking,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to create review' },
        { status: 500 }
      );
    }

    return NextResponse.json({ review: data });
  } catch (error) {
    console.error('Create review API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

