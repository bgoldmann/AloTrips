'use client';

import { useCallback } from 'react';
import { Vertical, ProviderType } from '@/types';
import { generateClickId } from '@/lib/tracking/clickId';
import { getSessionId, getUserType, getDeviceType } from '@/lib/tracking/session';
import { generateUTMParams, Placement } from '@/lib/tracking/utm';
import { buildAffiliateRedirectUrl } from '@/lib/tracking/redirect';

export interface TrackEventParams {
  name: string;
  vertical?: Vertical | 'esim' | 'insurance';
  provider?: ProviderType | string;
  placement?: Placement;
  routeOrDestination?: string;
  metadata?: Record<string, any>;
}

/**
 * Custom hook for tracking events
 */
export function useTracking() {
  const trackEvent = useCallback(async (params: TrackEventParams) => {
    const {
      name,
      vertical,
      provider,
      placement = 'results_row',
      routeOrDestination,
      metadata = {},
    } = params;

    const clickId = generateClickId();
    const sessionId = getSessionId();

    // Build event payload
    const eventPayload = {
      name,
      click_id: clickId,
      session_id: sessionId,
      user_type: getUserType(),
      device: getDeviceType(),
      vertical,
      provider,
      placement,
      route_or_destination: routeOrDestination,
      timestamp: new Date().toISOString(),
      ...metadata,
    };

    // Generate UTM params if vertical is provided
    if (vertical) {
      const utmParams = generateUTMParams(vertical, placement, routeOrDestination);
      Object.assign(eventPayload, utmParams);
    }

    try {
      // Send event to tracking endpoint
      await fetch('/api/tracking/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventPayload),
      });
    } catch (error) {
      console.error('Tracking error:', error);
      // Fail silently - don't break user experience
    }

    return clickId;
  }, []);

  const trackClick = useCallback(async (
    vertical: Vertical | 'esim' | 'insurance',
    provider: ProviderType | string,
    placement: Placement = 'results_row',
    routeOrDestination?: string
  ) => {
    const clickId = await trackEvent({
      name: 'click',
      vertical,
      provider,
      placement,
      routeOrDestination,
    });

    return clickId;
  }, [trackEvent]);

  const trackRedirect = useCallback((
    vertical: Vertical | 'esim' | 'insurance',
    provider: ProviderType | string,
    placement: Placement = 'results_row',
    routeOrDestination?: string
  ) => {
    const { url, clickId } = buildAffiliateRedirectUrl({
      vertical,
      provider,
      placement,
      routeOrDestination,
    });

    // Track the click before redirecting
    trackClick(vertical, provider, placement, routeOrDestination);

    return { url, clickId };
  }, [trackClick]);

  return {
    trackEvent,
    trackClick,
    trackRedirect,
  };
}

