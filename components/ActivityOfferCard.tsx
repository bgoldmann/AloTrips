'use client';

import React from 'react';
import Image from 'next/image';
import { Offer } from '@/types';
import { MapPin, Clock, Star, Calendar, CheckCircle, ArrowRight, Flame } from 'lucide-react';
import { useTracking } from '@/hooks/useTracking';
import { getCurrencySymbol } from '@/lib/currency';

interface ActivityOfferCardProps {
  offer: Offer;
}

const ActivityOfferCard: React.FC<ActivityOfferCardProps> = ({ offer }) => {
  const { trackRedirect } = useTracking();
  const currencySymbol = getCurrencySymbol(offer.currency as any);

  const handleViewDeal = () => {
    const { url } = trackRedirect(
      'things-to-do',
      offer.provider,
      'results_row',
      offer.title
    );
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all overflow-hidden">
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-orange-100 to-red-100 overflow-hidden">
        {offer.image ? (
          <Image 
            src={offer.image} 
            alt={offer.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized={offer.image?.includes('picsum.photos')}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Calendar size={48} className="text-orange-300" />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {offer.isCheapest && (
            <span className="bg-orange-500 text-white text-xs font-black px-3 py-1 rounded-full flex items-center gap-1">
              <Flame size={12} /> Cheapest
            </span>
          )}
          {offer.isBestValue && (
            <span className="bg-emerald-500 text-white text-xs font-black px-3 py-1 rounded-full flex items-center gap-1">
              <Star size={12} className="fill-white" /> Best Value
            </span>
          )}
        </div>

        {/* Category Badge */}
        {offer.activity_category && (
          <div className="absolute top-3 right-3">
            <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-bold px-3 py-1 rounded-full">
              {offer.activity_category}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title & Rating */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2">{offer.title}</h3>
            {offer.subtitle && (
              <p className="text-sm text-gray-600 mb-2">{offer.subtitle}</p>
            )}
          </div>
          
          {offer.rating > 0 && (
            <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg ml-3">
              <Star size={14} className="text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-bold text-gray-700">{offer.rating}</span>
              {offer.reviewCount > 0 && (
                <span className="text-xs text-gray-500 ml-1">({offer.reviewCount})</span>
              )}
            </div>
          )}
        </div>

        {/* Activity Details */}
        <div className="space-y-2 mb-4">
          {offer.activity_location && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <MapPin size={14} className="text-gray-400 flex-shrink-0" />
              <span className="truncate">{offer.activity_location}</span>
            </div>
          )}
          
          {offer.activity_duration && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Clock size={14} className="text-gray-400 flex-shrink-0" />
              <span>{offer.activity_duration}</span>
            </div>
          )}
          
          {offer.activity_start_time && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Calendar size={14} className="text-gray-400 flex-shrink-0" />
              <span>Start: {offer.activity_start_time}</span>
            </div>
          )}
        </div>

        {/* What's Included */}
        {offer.activity_includes && offer.activity_includes.length > 0 && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs font-semibold text-gray-700 mb-2">What's Included:</p>
            <div className="flex flex-wrap gap-2">
              {offer.activity_includes.slice(0, 3).map((item, idx) => (
                <div key={idx} className="flex items-center gap-1 text-xs text-gray-600">
                  <CheckCircle size={12} className="text-green-500" />
                  <span>{item}</span>
                </div>
              ))}
              {offer.activity_includes.length > 3 && (
                <span className="text-xs text-gray-500">+{offer.activity_includes.length - 3} more</span>
              )}
            </div>
          </div>
        )}

        {/* Refundable Badge */}
        {offer.refundable && (
          <div className="mb-4">
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 px-2 py-1 rounded">
              <CheckCircle size={12} />
              Free cancellation
            </span>
          </div>
        )}

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <div className="text-xs text-gray-500 mb-1">From</div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-gray-900">
                {currencySymbol}{Math.round(offer.total_price)}
              </span>
              <span className="text-sm text-gray-500">per person</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">via {offer.provider}</div>
          </div>
          
          <button
            onClick={handleViewDeal}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-orange-200 hover:-translate-y-0.5 flex items-center gap-2"
          >
            View Activity <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityOfferCard;

