'use client';

import React from 'react';
import { Smartphone, ShieldPlus, Package, X, Check } from 'lucide-react';
import { useTracking } from '@/hooks/useTracking';
import { UpsellRecommendation as UpsellRec } from '@/lib/upsells/rules';

interface UpsellModalProps {
  recommendation: UpsellRec;
  isOpen: boolean;
  onClose: () => void;
}

const UpsellModal: React.FC<UpsellModalProps> = ({ 
  recommendation, 
  isOpen,
  onClose 
}) => {
  const { trackRedirect } = useTracking();

  if (!isOpen) return null;

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
    onClose();
  };

  const renderESIMContent = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="bg-purple-600 text-white p-4 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-4">
          <Smartphone size={40} />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Stay Connected with eSIM</h2>
        <p className="text-gray-600">{recommendation.message || 'Get instant internet access in over 190 countries'}</p>
        {recommendation.reason && (
          <p className="text-sm text-purple-600 mt-2 font-medium">{recommendation.reason}</p>
        )}
      </div>

      <div className="bg-purple-50 rounded-xl p-4 space-y-3">
        <h3 className="font-bold text-purple-900 mb-2">Benefits:</h3>
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <Check size={20} className="text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-900">Instant Activation</p>
              <p className="text-sm text-gray-600">No need to swap SIM cards - works immediately</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Check size={20} className="text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-900">Keep Your Number</p>
              <p className="text-sm text-gray-600">Use your regular SIM for calls, eSIM for data</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Check size={20} className="text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-900">Affordable Plans</p>
              <p className="text-sm text-gray-600">Starting at $4.50 for short trips, up to $30 for extended travel</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Check size={20} className="text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-900">Global Coverage</p>
              <p className="text-sm text-gray-600">Works in 190+ countries with reliable 4G/5G speeds</p>
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={handleClick}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-xl text-lg transition-colors shadow-lg"
      >
        View eSIM Plans
      </button>
    </div>
  );

  const renderInsuranceContent = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="bg-emerald-600 text-white p-4 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-4">
          <ShieldPlus size={40} />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Protect Your Trip</h2>
        <p className="text-gray-600">{recommendation.message || 'Comprehensive coverage for peace of mind'}</p>
        {recommendation.reason && (
          <p className="text-sm text-emerald-600 mt-2 font-medium">{recommendation.reason}</p>
        )}
      </div>

      <div className="bg-emerald-50 rounded-xl p-4 space-y-3">
        <h3 className="font-bold text-emerald-900 mb-2">Coverage Includes:</h3>
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <Check size={20} className="text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-900">Trip Cancellation</p>
              <p className="text-sm text-gray-600">Get reimbursed if you need to cancel your trip</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Check size={20} className="text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-900">Medical Emergency</p>
              <p className="text-sm text-gray-600">Coverage for medical expenses and emergency evacuation</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Check size={20} className="text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-900">Baggage Protection</p>
              <p className="text-sm text-gray-600">Coverage for lost, stolen, or damaged luggage</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Check size={20} className="text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-900">24/7 Assistance</p>
              <p className="text-sm text-gray-600">Round-the-clock support for travel emergencies</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 text-center">
        <p className="text-sm text-gray-600">Starting at <span className="font-bold text-gray-900">$12</span> for trip protection</p>
      </div>

      <button 
        onClick={handleClick}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-xl text-lg transition-colors shadow-lg"
      >
        Get Insurance Quote
      </button>
    </div>
  );

  const renderBundleContent = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="bg-indigo-600 text-white p-4 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-4">
          <Package size={40} />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Bundle & Save</h2>
        <p className="text-gray-600">{recommendation.message || 'Get both eSIM and travel insurance together'}</p>
        {recommendation.reason && (
          <p className="text-sm text-indigo-600 mt-2 font-medium">{recommendation.reason}</p>
        )}
      </div>

      <div className="bg-indigo-50 rounded-xl p-4 space-y-3">
        <h3 className="font-bold text-indigo-900 mb-2">What's Included:</h3>
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <Check size={20} className="text-indigo-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-900">eSIM Data Plan</p>
              <p className="text-sm text-gray-600">Stay connected with instant internet access</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Check size={20} className="text-indigo-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-900">Travel Insurance</p>
              <p className="text-sm text-gray-600">Complete protection for your trip</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Check size={20} className="text-indigo-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-900">Save Up to 15%</p>
              <p className="text-sm text-gray-600">Bundle discount when you buy both together</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 text-center">
        <p className="text-sm text-gray-600">Bundle pricing from <span className="font-bold text-gray-900">$15</span> (save 15%)</p>
      </div>

      <button 
        onClick={handleClick}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-xl text-lg transition-colors shadow-lg"
      >
        View Bundle Deal
      </button>
    </div>
  );

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="upsell-modal-title"
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h3 id="upsell-modal-title" className="sr-only">Upsell Offer</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 -mr-2"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6">
          {recommendation.type === 'esim' && renderESIMContent()}
          {recommendation.type === 'insurance' && renderInsuranceContent()}
          {recommendation.type === 'bundle' && renderBundleContent()}
        </div>
      </div>
    </div>
  );
};

export default UpsellModal;

