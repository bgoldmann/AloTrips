import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAggregator } from '@/lib/providers';
import { SearchParams } from '@/types';
import { sendEmail } from '@/lib/email/service';

/**
 * Background job endpoint to check price alerts
 * This should be called by a cron job (e.g., Vercel Cron, or external scheduler)
 * 
 * Usage: GET /api/price-alerts/check
 * 
 * Checks all active price alerts and sends notifications when prices drop
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get all active price alerts
    const { data: alerts, error: alertsError } = await supabase
      .from('price_alerts')
      .select('*')
      .eq('status', 'active')
      .lte('expires_at', new Date().toISOString()) // Only check non-expired alerts
      .or('expires_at.is.null');

    if (alertsError) {
      console.error('Error fetching price alerts:', alertsError);
      return NextResponse.json(
        { error: 'Failed to fetch price alerts' },
        { status: 500 }
      );
    }

    if (!alerts || alerts.length === 0) {
      return NextResponse.json({ 
        message: 'No active price alerts to check',
        checked: 0 
      });
    }

    const aggregator = getAggregator();
    let checked = 0;
    let triggered = 0;

    // Check each alert
    for (const alert of alerts) {
      try {
        // Build search parameters from alert
        const searchParams: SearchParams = {
          destination: alert.destination,
          origin: alert.origin || undefined,
          startDate: alert.start_date || new Date().toISOString().split('T')[0],
          endDate: alert.end_date || undefined,
          travelers: 2, // Default
          ...(alert.search_params || {}),
        };

        // Search for current prices
        const responses = await aggregator.search(
          alert.vertical as any,
          searchParams,
          { timeout: 5000, useCache: true }
        );

        // Find cheapest offer
        let cheapestPrice: number | null = null;
        for (const response of responses) {
          if (response.data && response.data.length > 0) {
            const prices = response.data.map(o => o.total_price);
            const minPrice = Math.min(...prices);
            if (cheapestPrice === null || minPrice < cheapestPrice) {
              cheapestPrice = minPrice;
            }
          }
        }

        if (cheapestPrice === null) {
          // No results found, skip this alert
          continue;
        }

        checked++;

        // Update alert with current price
        const updateData: any = {
          current_price: cheapestPrice,
          last_checked_at: new Date().toISOString(),
        };

        // Update lowest price if this is lower
        if (!alert.lowest_price || cheapestPrice < alert.lowest_price) {
          updateData.lowest_price = cheapestPrice;
        }

        // Check if price dropped below target
        if (alert.target_price && cheapestPrice <= alert.target_price) {
          updateData.status = 'triggered';
          updateData.triggered_at = new Date().toISOString();
          triggered++;

          // Send email notification
          if (alert.notify_email) {
            try {
              // Get user email
              const { data: userData } = await supabase
                .from('users')
                .select('email, first_name')
                .eq('id', alert.user_id)
                .single();

              if (userData?.email) {
                await sendEmail({
                  to: userData.email,
                  subject: `🎉 Price Alert: ${alert.destination} price dropped!`,
                  html: `
                    <h2>Great news! Your price alert was triggered</h2>
                    <p>Hi ${userData.first_name || 'there'},</p>
                    <p>The price for ${alert.vertical} to <strong>${alert.destination}</strong> has dropped to <strong>$${cheapestPrice.toFixed(2)}</strong>!</p>
                    ${alert.target_price ? `<p>This is below your target price of $${alert.target_price.toFixed(2)}.</p>` : ''}
                    <p><a href="https://alotrips.me?destination=${encodeURIComponent(alert.destination)}" style="background: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin-top: 16px;">View Deal Now</a></p>
                    <p style="margin-top: 24px; color: #666; font-size: 12px;">This alert has been automatically triggered. You can manage your alerts in your account settings.</p>
                  `,
                });

                // Create email journey trigger
                await supabase
                  .from('email_journey_triggers')
                  .insert({
                    user_id: alert.user_id,
                    trigger_type: 'price_drop',
                    trigger_data: {
                      alert_id: alert.id,
                      destination: alert.destination,
                      vertical: alert.vertical,
                      price: cheapestPrice,
                      target_price: alert.target_price,
                    },
                    status: 'sent',
                    email_sent: true,
                    email_sent_at: new Date().toISOString(),
                  });
              }
            } catch (emailError) {
              console.error('Error sending price alert email:', emailError);
              // Continue even if email fails
            }
          }
        }

        // Update alert
        await supabase
          .from('price_alerts')
          .update(updateData)
          .eq('id', alert.id);

      } catch (alertError) {
        console.error(`Error checking alert ${alert.id}:`, alertError);
        // Continue with next alert
      }
    }

    return NextResponse.json({ 
      message: 'Price alerts checked',
      checked,
      triggered,
      total: alerts.length
    });
  } catch (error) {
    console.error('Price alerts check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

