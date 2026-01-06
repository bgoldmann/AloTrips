import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Postback endpoint for affiliate conversions
 * Partners can call this endpoint to report conversions
 * Based on PRD Section 11.4
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      conversion_id,
      click_id,
      amount,
      currency = 'USD',
      provider,
      vertical,
      booking_reference,
      ...metadata
    } = body;

    // Validate required fields
    if (!conversion_id || !click_id || !amount || !provider || !vertical) {
      return NextResponse.json(
        { error: 'Missing required fields: conversion_id, click_id, amount, provider, vertical' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Store conversion
    const conversionData: any = {
      conversion_id,
      click_id,
      amount: Number(amount),
      currency,
      provider,
      vertical,
      booking_reference,
      metadata: metadata || {},
    };
    const { error } = await (supabase
      .from('affiliate_conversions') as any)
      .insert(conversionData);

    if (error) {
      console.error('Error storing conversion:', error);
      return NextResponse.json(
        { error: 'Failed to store conversion' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Postback error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to retrieve conversion by click_id (for verification)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const clickId = searchParams.get('click_id');

    if (!clickId) {
      return NextResponse.json(
        { error: 'Missing click_id parameter' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('affiliate_conversions')
      .select('*')
      .eq('click_id', clickId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Conversion not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ conversion: data });
  } catch (error) {
    console.error('Get conversion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

