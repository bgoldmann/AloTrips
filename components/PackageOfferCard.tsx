'use client';

import React from 'react';
import { PackageOffer } from '@/lib/packages/bundler';
import { Flame, Star, ArrowRight, Plane, Bed, Car, Package as PackageIcon } from 'lucide-react';
import { useTracking } from '@/hooks/useTracking';
import { getCurrencySymbol } from '@/lib/currency';

interface PackageOfferCardProps {
  packageOffer: PackageOffer;
}

const PackageOfferCard: React.FC<PackageOfferCardProps> = ({ packageOffer }) => {
  const { trackRedirect } = useTracking();
  const currencySymbol = getCurrencySymbol(packageOffer.currency as any);

  const handleViewDeal = () => {
    // Track package click
    const { url } = trackRedirect(
      'packages',
      packageOffer.provider,
      'results_row',
      packageOffer.title
    );
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getPackageIcon = () => {
    switch (packageOffer.type) {
      case 'flight-hotel':
        return <Plane size={16} className="text-orange-500" />;
      case 'hotel-car':
        return <Car size={16} className="text-orange-500" />;
      case 'flight-hotel-car':
        return <PackageIcon size={16} className="text-orange-500" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {getPackageIcon()}
              <h3 className="font-bold text-lg text-gray-900">{packageOffer.title}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">{packageOffer.subtitle}</p>
            
            {/* Savings Badge */}
            {packageOffer.savings > 0 && (
              <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-1 mb-3">
                <Flame size={14} className="text-green-600" />
                <span className="text-sm font-bold text-green-700">
                  Save {currencySymbol}{Math.round(packageOffer.savings)} ({Math.round(packageOffer.savingsPercent)}% off)
                </span>
              </div>
            )}
          </div>

          {/* Rating */}
          {packageOffer.rating && (
            <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
              <Star size={14} className="text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-bold text-gray-700">{packageOffer.rating}</span>
            </div>
          )}
        </div>

        {/* Package Components */}
        <div className="space-y-2 mb-4">
          {packageOffer.components.flight && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Plane size={14} className="text-gray-400" />
              <span className="font-medium">{packageOffer.components.flight.title}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">{packageOffer.components.flight.subtitle}</span>
            </div>
          )}
          {packageOffer.components.hotel && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Bed size={14} className="text-gray-400" />
              <span className="font-medium">{packageOffer.components.hotel.title}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">{packageOffer.components.hotel.subtitle}</span>
            </div>
          )}
          {packageOffer.components.car && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Car size={14} className="text-gray-400" />
              <span className="font-medium">{packageOffer.components.car.title}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">{packageOffer.components.car.subtitle}</span>
            </div>
          )}
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <div className="text-xs text-gray-500 mb-1">Total Package Price</div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-gray-900">
                {currencySymbol}{Math.round(packageOffer.totalPrice)}
              </span>
              {packageOffer.savings > 0 && (
                <span className="text-lg text-gray-400 line-through">
                  {currencySymbol}{Math.round(packageOffer.totalPrice + packageOffer.savings)}
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-1">via {packageOffer.provider}</div>
          </div>
          
          <button
            onClick={handleViewDeal}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-orange-200 hover:-translate-y-0.5 flex items-center gap-2"
          >
            View Package <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackageOfferCard;

