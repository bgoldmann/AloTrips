import { Vertical, ProviderType } from '@/types';
import { generateUTMParams, utmParamsToQueryString, Placement } from './utm';
import { generateClickId } from './clickId';
import { getSessionId, getUserType, getDeviceType } from './session';

export interface AffiliateRedirectParams {
  vertical: Vertical | 'esim' | 'insurance';
  provider: ProviderType | string;
  placement: Placement;
  routeOrDestination?: string;
  affiliateId?: string;
  baseUrl?: string;
}

/**
 * Build affiliate redirect URL with all tracking parameters
 * Based on PRD Section 11.3
 */
export function buildAffiliateRedirectUrl(params: AffiliateRedirectParams): {
  url: string;
  clickId: string;
} {
  const {
    vertical,
    provider,
    placement,
    routeOrDestination,
    affiliateId = 'ALO123', // Default affiliate ID, should come from config
    baseUrl,
  } = params;

  // Generate click ID
  const clickId = generateClickId();

  // Generate UTM parameters
  const utmParams = generateUTMParams(vertical, placement, routeOrDestination);

  // Build query parameters
  const queryParams = new URLSearchParams();
  
  // Affiliate parameters
  if (affiliateId) {
    queryParams.append('affiliate_id', affiliateId);
  }
  queryParams.append('click_id', clickId);
  
  // First-party tracking IDs
  queryParams.append('at_click_id', clickId);
  queryParams.append('at_session_id', getSessionId());
  queryParams.append('at_user_type', getUserType());
  queryParams.append('at_device', getDeviceType());

  // UTM parameters
  Object.entries(utmParams).forEach(([key, value]) => {
    if (value) {
      queryParams.append(key, value);
    }
  });

  // Build final URL
  const base = baseUrl || getProviderBaseUrl(provider);
  const separator = base.includes('?') ? '&' : '?';
  const url = `${base}${separator}${queryParams.toString()}`;

  return { url, clickId };
}

/**
 * Get base URL for provider (stub - should come from provider config)
 */
function getProviderBaseUrl(provider: ProviderType | string): string {
  // In production, these would come from provider configuration
  const providerUrls: Record<string, string> = {
    'expedia': 'https://www.expedia.com',
    'travelpayouts': 'https://www.aviasales.com',
    'skyscanner': 'https://www.skyscanner.com',
    'kiwi': 'https://www.kiwi.com',
    'booking': 'https://www.booking.com',
    'agoda': 'https://www.agoda.com',
  };

  return providerUrls[provider.toLowerCase()] || 'https://example.com';
}

/**
 * Build redirect URL for upsells (eSIM, Insurance)
 */
export function buildUpsellRedirectUrl(
  type: 'esim' | 'insurance',
  placement: Placement = 'upsell_banner'
): { url: string; clickId: string } {
  // These URLs should come from partner configuration
  const upsellUrls: Record<string, string> = {
    'esim': 'https://www.alotelcom.com',
    'insurance': 'https://www.travelinsurance.com',
  };

  return buildAffiliateRedirectUrl({
    vertical: type,
    provider: type,
    placement,
    baseUrl: upsellUrls[type],
  });
}

