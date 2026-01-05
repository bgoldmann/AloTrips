import { NextRequest, NextResponse } from 'next/server';
import { getExchangeRate, getCachedRate, Currency } from '@/lib/currency/converter';

/**
 * GET /api/currency/rates
 * Get exchange rates for currency conversion
 * 
 * Query params:
 * - from: Base currency (default: USD)
 * - to: Target currency (default: EUR)
 * - currencies: Comma-separated list of currencies to get rates for
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const from = (searchParams.get('from') || 'USD') as Currency;
    const to = (searchParams.get('to') || 'EUR') as Currency;
    const currenciesParam = searchParams.get('currencies');

    // If specific currencies requested, return rates for all of them
    if (currenciesParam) {
      const currencies = currenciesParam.split(',') as Currency[];
      const rates: Record<string, number> = {};

      await Promise.all(
        currencies.map(async (currency) => {
          if (currency !== from) {
            try {
              const rate = await getExchangeRate(from, currency);
              rates[currency] = rate;
            } catch (error) {
              console.error(`Failed to get rate for ${currency}:`, error);
              // Use fallback rate
              rates[currency] = null as any;
            }
          } else {
            rates[currency] = 1.0;
          }
        })
      );

      return NextResponse.json({
        base: from,
        rates,
        timestamp: Date.now(),
      });
    }

    // Single rate request
    const rate = await getExchangeRate(from, to);

    return NextResponse.json({
      from,
      to,
      rate,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Currency rates API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exchange rates' },
      { status: 500 }
    );
  }
}

