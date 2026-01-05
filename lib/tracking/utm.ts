import { Vertical } from '@/types';

export type Placement = 'results_row' | 'top_banner' | 'price_box' | 'confirmation' | 'email' | 'upsell_banner';

export interface UTMParams {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term?: string;
}

/**
 * Generate UTM parameters for affiliate tracking
 * Based on PRD Section 11.1
 */
export function generateUTMParams(
  vertical: Vertical | 'esim' | 'insurance',
  placement: Placement,
  routeOrDestination?: string
): UTMParams {
  // Map vertical to campaign name
  const campaignMap: Record<string, string> = {
    'flights': 'flights',
    'stays': 'hotels',
    'cars': 'cars',
    'packages': 'packages',
    'cruises': 'cruises',
    'things-to-do': 'activities',
    'esim': 'esim',
    'insurance': 'insurance',
  };

  return {
    utm_source: 'alotrips',
    utm_medium: 'affiliate',
    utm_campaign: campaignMap[vertical] || vertical,
    utm_content: placement,
    utm_term: routeOrDestination,
  };
}

/**
 * Convert UTM params to URL query string
 */
export function utmParamsToQueryString(params: UTMParams): string {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      queryParams.append(key, value);
    }
  });

  return queryParams.toString();
}

/**
 * Parse UTM params from URL query string
 */
export function parseUTMParamsFromQuery(queryString: string): Partial<UTMParams> {
  const params = new URLSearchParams(queryString);
  const utmParams: Partial<UTMParams> = {};

  if (params.get('utm_source')) utmParams.utm_source = params.get('utm_source')!;
  if (params.get('utm_medium')) utmParams.utm_medium = params.get('utm_medium')!;
  if (params.get('utm_campaign')) utmParams.utm_campaign = params.get('utm_campaign')!;
  if (params.get('utm_content')) utmParams.utm_content = params.get('utm_content')!;
  if (params.get('utm_term')) utmParams.utm_term = params.get('utm_term')!;

  return utmParams;
}

