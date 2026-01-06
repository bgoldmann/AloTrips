import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * EPC Learning Loop - Analyzes conversion data to optimize EPC
 * Based on PRD Section 12 - Decision Engine optimization
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { periodDays = 30 } = body;

    // Calculate period
    const periodEnd = new Date();
    const periodStart = new Date();
    periodStart.setDate(periodStart.getDate() - periodDays);

    // Get all conversions with their clicks
    const { data: conversions, error: conversionsError } = await supabase
      .from('affiliate_conversions')
      .select(`
        *,
        affiliate_clicks!inner(
          provider,
          vertical,
          click_id
        )
      `)
      .gte('created_at', periodStart.toISOString())
      .lte('created_at', periodEnd.toISOString());

    if (conversionsError) {
      console.error('Error fetching conversions:', conversionsError);
      return NextResponse.json(
        { error: 'Failed to fetch conversion data' },
        { status: 500 }
      );
    }

    // Group by provider and vertical
    const epcData: Record<string, {
      provider: string;
      vertical: string;
      clicks: number;
      conversions: number;
      revenue: number;
      epc: number;
    }> = {};

    // Get all clicks for the period
    const { data: clicks, error: clicksError } = await supabase
      .from('affiliate_clicks')
      .select('provider, vertical, click_id')
      .gte('created_at', periodStart.toISOString())
      .lte('created_at', periodEnd.toISOString());

    if (clicksError) {
      console.error('Error fetching clicks:', clicksError);
      return NextResponse.json(
        { error: 'Failed to fetch click data' },
        { status: 500 }
      );
    }

    // Count clicks by provider/vertical
    const clickCounts: Record<string, number> = {};
    clicks?.forEach(click => {
      const key = `${click.provider}_${click.vertical}`;
      clickCounts[key] = (clickCounts[key] || 0) + 1;
    });

    // Process conversions
    conversions?.forEach((conversion: any) => {
      const click = conversion.affiliate_clicks;
      if (!click) return;

      const key = `${click.provider}_${click.vertical}`;
      if (!epcData[key]) {
        epcData[key] = {
          provider: click.provider,
          vertical: click.vertical,
          clicks: 0,
          conversions: 0,
          revenue: 0,
          epc: 0,
        };
      }

      epcData[key].conversions += 1;
      epcData[key].revenue += Number(conversion.amount || 0);
    });

    // Calculate EPC and update database
    const updates = [];
    for (const key in epcData) {
      const data = epcData[key];
      const totalClicks = clickCounts[key] || 0;
      data.clicks = totalClicks;
      
      if (totalClicks > 0) {
        data.epc = data.revenue / totalClicks;
      }

      // Calculate confidence score (based on sample size)
      const sampleSize = totalClicks;
      const confidenceScore = Math.min(1.0, Math.log10(sampleSize + 1) / 3); // Logarithmic scale

      // Upsert EPC learning data
      const { error: upsertError } = await (supabase
        .from('epc_learning') as any)
        .upsert({
          provider: data.provider,
          vertical: data.vertical,
          total_clicks: totalClicks,
          total_conversions: data.conversions,
          total_revenue: data.revenue,
          calculated_epc: data.epc,
          period_start: periodStart.toISOString().split('T')[0],
          period_end: periodEnd.toISOString().split('T')[0],
          sample_size: sampleSize,
          confidence_score: confidenceScore,
        }, {
          onConflict: 'provider,vertical,period_start,period_end',
        });

      if (upsertError) {
        console.error(`Error upserting EPC data for ${key}:`, upsertError);
      } else {
        updates.push(data);
      }
    }

    return NextResponse.json({
      success: true,
      period: {
        start: periodStart.toISOString().split('T')[0],
        end: periodEnd.toISOString().split('T')[0],
      },
      updates: updates,
      summary: {
        totalProviders: Object.keys(epcData).length,
        totalClicks: Object.values(clickCounts).reduce((a, b) => a + b, 0),
        totalConversions: conversions?.length || 0,
      },
    });
  } catch (error) {
    console.error('EPC learning error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;
    const provider = searchParams.get('provider');
    const vertical = searchParams.get('vertical');

    let query = supabase
      .from('epc_learning')
      .select('*')
      .order('period_end', { ascending: false })
      .limit(100);

    if (provider) {
      query = query.eq('provider', provider);
    }
    if (vertical) {
      query = query.eq('vertical', vertical);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching EPC learning data:', error);
      return NextResponse.json(
        { error: 'Failed to fetch EPC learning data' },
        { status: 500 }
      );
    }

    return NextResponse.json({ epcData: data || [] });
  } catch (error) {
    console.error('EPC learning GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

