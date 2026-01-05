'use client';

import React, { useState, useEffect } from 'react';
import { Smartphone, ShieldPlus, Package, X } from 'lucide-react';
import { useTracking } from '@/hooks/useTracking';
import { UpsellRecommendation as UpsellRec } from '@/lib/upsells/rules';

interface UpsellRecommendationProps {
  recommendation: UpsellRec;
  onDismiss?: () => void;
}

const UpsellRecommendation: React.FC<UpsellRecommendationProps> = ({ 
  recommendation, 
  onDismiss 
}) => {
  const { trackRedirect } = useTracking();
  const [isDismissed, setIsDismissed] = useState(false);

  // Check if dismissed in session storage
  useEffect(() => {
    const dismissedKey = `upsell_dismissed_${recommendation.type}`;
    const dismissed = sessionStorage.getItem(dismissedKey);
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, [recommendation.type]);

  const handleDismiss = () => {
    const dismissedKey = `upsell_dismissed_${recommendation.type}`;
    sessionStorage.setItem(dismissedKey, 'true');
    setIsDismissed(true);
    onDismiss?.();
  };

  const handleClick = () => {
    if (recommendation.type === 'bundle') {
      // For bundle, track both
      trackRedirect('esim', 'esim', 'upsell_banner');
      trackRedirect('insurance', 'insurance', 'upsell_banner');
      // Open eSIM page (could be a bundle page in production)
      const { url } = trackRedirect('esim', 'esim', 'upsell_banner');
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      const { url } = trackRedirect(
        recommendation.type as 'esim' | 'insurance',
        recommendation.type as 'esim' | 'insurance',
        'upsell_banner'
      );
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  if (isDismissed) return null;

  if (recommendation.type === 'esim') {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4 mb-4 flex items-center justify-between shadow-sm relative">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-purple-400 hover:text-purple-600 transition-colors"
          aria-label="Dismiss"
        >
          <X size={18} />
        </button>
        <div className="flex items-center gap-4 pr-8">
          <div className="bg-purple-600 text-white p-2 rounded-lg">
            <Smartphone size={24} />
          </div>
          <div>
            <h4 className="font-bold text-purple-900">Don't roam alone!</h4>
            <p className="text-sm text-purple-700">{recommendation.message || 'Get an eSIM for your trip starting at $4.50 from AloTelcom.'}</p>
            {recommendation.reason && (
              <p className="text-xs text-purple-600 mt-1">{recommendation.reason}</p>
            )}
          </div>
        </div>
        <button 
          onClick={handleClick}
          className="bg-white text-purple-700 border border-purple-200 hover:bg-purple-50 font-semibold px-4 py-2 rounded-lg text-sm transition flex items-center justify-center"
        >
          View Plans
        </button>
      </div>
    );
  }

  if (recommendation.type === 'insurance') {
    return (
      <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-4 mb-4 flex items-center justify-between shadow-sm relative">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-emerald-400 hover:text-emerald-600 transition-colors"
          aria-label="Dismiss"
        >
          <X size={18} />
        </button>
        <div className="flex items-center gap-4 pr-8">
          <div className="bg-emerald-600 text-white p-2 rounded-lg">
            <ShieldPlus size={24} />
          </div>
          <div>
            <h4 className="font-bold text-emerald-900">Protect your trip</h4>
            <p className="text-sm text-emerald-700">{recommendation.message || 'Medical & cancellation coverage from $12.'}</p>
            {recommendation.reason && (
              <p className="text-xs text-emerald-600 mt-1">{recommendation.reason}</p>
            )}
          </div>
        </div>
        <button 
          onClick={handleClick}
          className="bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50 font-semibold px-4 py-2 rounded-lg text-sm transition"
        >
          Get Quote
        </button>
      </div>
    );
  }

  if (recommendation.type === 'bundle') {
    return (
      <div className="bg-gradient-to-r from-indigo-50 to-blue-100 border border-indigo-200 rounded-xl p-4 mb-4 flex items-center justify-between shadow-sm relative">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-indigo-400 hover:text-indigo-600 transition-colors"
          aria-label="Dismiss"
        >
          <X size={18} />
        </button>
        <div className="flex items-center gap-4 pr-8">
          <div className="bg-indigo-600 text-white p-2 rounded-lg">
            <Package size={24} />
          </div>
          <div>
            <h4 className="font-bold text-indigo-900">Bundle & Save</h4>
            <p className="text-sm text-indigo-700">{recommendation.message || 'Get eSIM + Travel Insurance together and save!'}</p>
            {recommendation.reason && (
              <p className="text-xs text-indigo-600 mt-1">{recommendation.reason}</p>
            )}
          </div>
        </div>
        <button 
          onClick={handleClick}
          className="bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 font-semibold px-4 py-2 rounded-lg text-sm transition"
        >
          View Bundle
        </button>
      </div>
    );
  }

  return null;
};

export default UpsellRecommendation;

