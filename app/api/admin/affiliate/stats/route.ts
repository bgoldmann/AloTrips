import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface DateRange {
  startDate?: string;
  endDate?: string;
}

/**
 * GET /api/admin/affiliate/stats
 * Returns comprehensive affiliate performance metrics
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build date filter
    let dateFilter: any = {};
    if (startDate) {
      dateFilter.gte = startDate;
    }
    if (endDate) {
      dateFilter.lte = endDate;
    }

    // 1. Total Clicks
    let clicksQuery = supabase
      .from('affiliate_clicks')
      .select('*', { count: 'exact' });
    
    if (startDate || endDate) {
      clicksQuery = clicksQuery.gte('created_at', startDate || '1970-01-01')
        .lte('created_at', endDate || new Date().toISOString());
    }

    const { count: totalClicks, data: allClicks } = await clicksQuery;

    // 2. Clicks by Provider
    let clicksByProviderQuery = supabase
      .from('affiliate_clicks')
      .select('provider');
    
    if (startDate || endDate) {
      clicksByProviderQuery = clicksByProviderQuery
        .gte('created_at', startDate || '1970-01-01')
        .lte('created_at', endDate || new Date().toISOString());
    }
    
    const { data: clicksByProvider } = await clicksByProviderQuery;

    const providerCounts: Record<string, number> = {};
    clicksByProvider?.forEach((click) => {
      providerCounts[click.provider] = (providerCounts[click.provider] || 0) + 1;
    });

    // 3. Clicks by Vertical
    let clicksByVerticalQuery = supabase
      .from('affiliate_clicks')
      .select('vertical');
    
    if (startDate || endDate) {
      clicksByVerticalQuery = clicksByVerticalQuery
        .gte('created_at', startDate || '1970-01-01')
        .lte('created_at', endDate || new Date().toISOString());
    }
    
    const { data: clicksByVertical } = await clicksByVerticalQuery;

    const verticalCounts: Record<string, number> = {};
    clicksByVertical?.forEach((click) => {
      verticalCounts[click.vertical] = (verticalCounts[click.vertical] || 0) + 1;
    });

    // 4. Clicks by Placement
    let clicksByPlacementQuery = supabase
      .from('affiliate_clicks')
      .select('placement');
    
    if (startDate || endDate) {
      clicksByPlacementQuery = clicksByPlacementQuery
        .gte('created_at', startDate || '1970-01-01')
        .lte('created_at', endDate || new Date().toISOString());
    }
    
    const { data: clicksByPlacement } = await clicksByPlacementQuery;

    const placementCounts: Record<string, number> = {};
    clicksByPlacement?.forEach((click) => {
      placementCounts[click.placement] = (placementCounts[click.placement] || 0) + 1;
    });

    // 5. Total Conversions
    let conversionsQuery = supabase
      .from('affiliate_conversions')
      .select('*', { count: 'exact' });
    
    if (startDate || endDate) {
      conversionsQuery = conversionsQuery
        .gte('created_at', startDate || '1970-01-01')
        .lte('created_at', endDate || new Date().toISOString());
    }

    const { count: totalConversions, data: allConversions } = await conversionsQuery;

    // 6. Conversion Rate
    const conversionRate = totalClicks && totalClicks > 0
      ? ((totalConversions || 0) / totalClicks) * 100
      : 0;

    // 7. Total Revenue (from conversions)
    const totalRevenue = allConversions?.reduce(
      (sum, conv) => sum + Number(conv.amount || 0),
      0
    ) || 0;

    // 8. EPC (Earnings Per Click) - Average revenue per click
    const epc = totalClicks && totalClicks > 0
      ? totalRevenue / totalClicks
      : 0;

    // 9. Conversions by Provider
    let conversionsByProviderQuery = supabase
      .from('affiliate_conversions')
      .select('provider, amount');
    
    if (startDate || endDate) {
      conversionsByProviderQuery = conversionsByProviderQuery
        .gte('created_at', startDate || '1970-01-01')
        .lte('created_at', endDate || new Date().toISOString());
    }
    
    const { data: conversionsByProvider } = await conversionsByProviderQuery;

    const providerRevenue: Record<string, { revenue: number; conversions: number }> = {};
    conversionsByProvider?.forEach((conv) => {
      if (!providerRevenue[conv.provider]) {
        providerRevenue[conv.provider] = { revenue: 0, conversions: 0 };
      }
      providerRevenue[conv.provider].revenue += Number(conv.amount || 0);
      providerRevenue[conv.provider].conversions += 1;
    });

    // 10. Conversions by Vertical
    let conversionsByVerticalQuery = supabase
      .from('affiliate_conversions')
      .select('vertical, amount');
    
    if (startDate || endDate) {
      conversionsByVerticalQuery = conversionsByVerticalQuery
        .gte('created_at', startDate || '1970-01-01')
        .lte('created_at', endDate || new Date().toISOString());
    }
    
    const { data: conversionsByVertical } = await conversionsByVerticalQuery;

    const verticalRevenue: Record<string, { revenue: number; conversions: number }> = {};
    conversionsByVertical?.forEach((conv) => {
      if (!verticalRevenue[conv.vertical]) {
        verticalRevenue[conv.vertical] = { revenue: 0, conversions: 0 };
      }
      verticalRevenue[conv.vertical].revenue += Number(conv.amount || 0);
      verticalRevenue[conv.vertical].conversions += 1;
    });

    // 11. Daily Click/Conversion History (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data: dailyClicks } = await supabase
      .from('affiliate_clicks')
      .select('created_at')
      .gte('created_at', thirtyDaysAgo.toISOString());

    const { data: dailyConversions } = await supabase
      .from('affiliate_conversions')
      .select('created_at, amount')
      .gte('created_at', thirtyDaysAgo.toISOString());

    // Group by date
    const dailyStats: Record<string, { clicks: number; conversions: number; revenue: number }> = {};
    
    dailyClicks?.forEach((click) => {
      const date = new Date(click.created_at).toISOString().split('T')[0];
      if (!dailyStats[date]) {
        dailyStats[date] = { clicks: 0, conversions: 0, revenue: 0 };
      }
      dailyStats[date].clicks += 1;
    });

    dailyConversions?.forEach((conv) => {
      const date = new Date(conv.created_at).toISOString().split('T')[0];
      if (!dailyStats[date]) {
        dailyStats[date] = { clicks: 0, conversions: 0, revenue: 0 };
      }
      dailyStats[date].conversions += 1;
      dailyStats[date].revenue += Number(conv.amount || 0);
    });

    // Convert to array format for charts
    const revenueHistory = Object.entries(dailyStats)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, stats]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        clicks: stats.clicks,
        conversions: stats.conversions,
        revenue: stats.revenue,
        epc: stats.clicks > 0 ? stats.revenue / stats.clicks : 0,
      }));

    // 12. Provider Performance Comparison
    const providerPerformance = Object.entries(providerCounts).map(([provider, clicks]) => {
      const providerConv = providerRevenue[provider] || { revenue: 0, conversions: 0 };
      const providerEpc = clicks > 0 ? providerConv.revenue / clicks : 0;
      const providerConvRate = clicks > 0 ? (providerConv.conversions / clicks) * 100 : 0;

      return {
        provider,
        clicks,
        conversions: providerConv.conversions,
        revenue: providerConv.revenue,
        epc: providerEpc,
        conversionRate: providerConvRate,
      };
    }).sort((a, b) => b.revenue - a.revenue);

    // 13. Placement Performance
    const placementPerformance = Object.entries(placementCounts).map(([placement, clicks]) => {
      // Find conversions for this placement (need to join with clicks)
      const placementClicks = allClicks?.filter(c => c.placement === placement) || [];
      const placementClickIds = placementClicks.map(c => c.click_id);
      
      const placementConversions = allConversions?.filter(c => 
        placementClickIds.includes(c.click_id)
      ) || [];
      
      const placementRevenue = placementConversions.reduce(
        (sum, conv) => sum + Number(conv.amount || 0),
        0
      );
      const placementEpc = clicks > 0 ? placementRevenue / clicks : 0;
      const placementConvRate = clicks > 0 ? (placementConversions.length / clicks) * 100 : 0;

      return {
        placement,
        clicks,
        conversions: placementConversions.length,
        revenue: placementRevenue,
        epc: placementEpc,
        conversionRate: placementConvRate,
      };
    }).sort((a, b) => b.revenue - a.revenue);

    return NextResponse.json({
      metrics: {
        totalClicks: totalClicks || 0,
        totalConversions: totalConversions || 0,
        conversionRate: Number(conversionRate.toFixed(2)),
        totalRevenue: Number(totalRevenue.toFixed(2)),
        epc: Number(epc.toFixed(4)),
      },
      clicksByProvider: providerCounts,
      clicksByVertical: verticalCounts,
      clicksByPlacement: placementCounts,
      providerPerformance,
      placementPerformance,
      revenueHistory,
      verticalPerformance: Object.entries(verticalCounts).map(([vertical, clicks]) => {
        const verticalConv = verticalRevenue[vertical] || { revenue: 0, conversions: 0 };
        const verticalEpc = clicks > 0 ? verticalConv.revenue / clicks : 0;
        const verticalConvRate = clicks > 0 ? (verticalConv.conversions / clicks) * 100 : 0;

        return {
          vertical,
          clicks,
          conversions: verticalConv.conversions,
          revenue: verticalConv.revenue,
          epc: verticalEpc,
          conversionRate: verticalConvRate,
        };
      }).sort((a, b) => b.revenue - a.revenue),
    });
  } catch (error) {
    console.error('Affiliate stats API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

