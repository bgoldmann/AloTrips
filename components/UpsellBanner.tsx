'use client';

import React from 'react';
import { Smartphone, ShieldPlus } from 'lucide-react';
import { useTracking } from '@/hooks/useTracking';

const UpsellBanner: React.FC<{ type: 'esim' | 'insurance' }> = ({ type }) => {
  const { trackRedirect } = useTracking();

  const handleClick = () => {
    const { url } = trackRedirect(
      type,
      type,
      'upsell_banner'
    );
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (type === 'esim') {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4 mb-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-purple-600 text-white p-2 rounded-lg">
            <Smartphone size={24} />
          </div>
          <div>
            <h4 className="font-bold text-purple-900">Don't roam alone!</h4>
            <p className="text-sm text-purple-700">Get an eSIM for your trip starting at $4.50 from AloTelcom.</p>
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

  return (
    <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-4 mb-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <div className="bg-emerald-600 text-white p-2 rounded-lg">
          <ShieldPlus size={24} />
        </div>
        <div>
          <h4 className="font-bold text-emerald-900">Protect your trip</h4>
          <p className="text-sm text-emerald-700">Medical & cancellation coverage from $12.</p>
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
};

export default UpsellBanner;