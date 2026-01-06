import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      click_id,
      session_id,
      user_type,
      device,
      vertical,
      provider,
      placement,
      route_or_destination,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term,
      ...metadata
    } = body;

    // Validate required fields
    if (!click_id || !session_id) {
      return NextResponse.json(
        { error: 'Missing required fields: click_id, session_id' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // For click events, store in affiliate_clicks table
    if (name === 'click' && vertical && provider && placement) {
      const clickData: any = {
        click_id,
        session_id,
        provider,
        vertical,
        placement,
        utm_source: utm_source || 'alotrips',
        utm_medium: utm_medium || 'affiliate',
        utm_campaign: utm_campaign || vertical,
        utm_content: utm_content || placement,
        utm_term: route_or_destination,
        at_user_type: user_type,
        at_device: device,
        route_or_destination,
        metadata: metadata || {},
      };
      
      const { error } = await supabase
        .from('affiliate_clicks')
        .insert(clickData);

      if (error) {
        console.error('Error storing click:', error);
        // Don't fail the request - tracking should be non-blocking
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Tracking event error:', error);
    // Return success even on error - tracking should not break user experience
    return NextResponse.json({ success: true });
  }
}

