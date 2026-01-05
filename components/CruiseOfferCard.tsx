'use client';

import React from 'react';
import Image from 'next/image';
import { Offer } from '@/types';
import { Ship, MapPin, Calendar, Users, Star, Anchor, CheckCircle, ArrowRight } from 'lucide-react';
import { useTracking } from '@/hooks/useTracking';
import { getCurrencySymbol } from '@/lib/currency';

interface CruiseOfferCardProps {
  offer: Offer;
}

const CruiseOfferCard: React.FC<CruiseOfferCardProps> = ({ offer }) => {
  const { trackRedirect } = useTracking();
  const currencySymbol = getCurrencySymbol(offer.currency as any);

  const handleViewDeal = () => {
    const { url } = trackRedirect(
      'cruises',
      offer.provider,
      'results_row',
      offer.cruise_ship || offer.title
    );
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
      {/* Image and Badges */}
      <div className="relative w-full h-48 md:h-56 rounded-xl overflow-hidden mb-4">
        <Image 
          src={offer.image || `https://picsum.photos/seed/${offer.id}/400/300`}
          alt={offer.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized={offer.image?.includes('picsum.photos')}
        />
        {offer.cruise_line && (
          <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
            {offer.cruise_line}
          </span>
        )}
        {offer.isCheapest && (
          <span className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
            <Anchor size={12} /> Cheapest
          </span>
        )}
        {offer.isBestValue && (
          <span className="absolute top-12 right-3 bg-emerald-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
            <Star size={12} className="fill-white" /> Best Value
          </span>
        )}
      </div>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{offer.title}</h3>
          {offer.cruise_ship && (
            <p className="text-sm text-gray-600 flex items-center gap-1.5 mb-2">
              <Ship size={14} className="text-blue-500" /> {offer.cruise_ship}
            </p>
          )}
          {offer.cruise_region && (
            <p className="text-sm text-gray-600 flex items-center gap-1.5">
              <MapPin size={14} className="text-blue-500" /> {offer.cruise_region}
            </p>
          )}
        </div>
        <div className="flex-shrink-0 text-right md:ml-4 mt-2 md:mt-0">
          <p className="text-sm text-gray-500">From</p>
          <p className="text-2xl font-black text-blue-600">
            {currencySymbol}
            {convertedPrice.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-gray-500">per person</p>
        </div>
      </div>

      {/* Cruise Details */}
      <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-700 mb-4">
        {offer.cruise_duration && (
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-blue-500" /> {offer.cruise_duration} nights
          </div>
        )}
        {offer.cruise_departure_port && (
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-blue-500" /> Departs: {offer.cruise_departure_port}
          </div>
        )}
        {offer.cruise_cabin_type && (
          <div className="flex items-center gap-2">
            <Users size={16} className="text-blue-500" /> {offer.cruise_cabin_type}
          </div>
        )}
        {offer.rating > 0 && (
          <div className="flex items-center gap-2">
            <Star size={16} className="text-yellow-500 fill-yellow-500" /> {offer.rating.toFixed(1)} ({offer.reviewCount} reviews)
          </div>
        )}
        {offer.refundable && (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle size={16} className="fill-green-500 text-white" /> Free Cancellation
          </div>
        )}
      </div>

      {/* Ports of Call */}
      {offer.cruise_ports && offer.cruise_ports.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-bold text-gray-700 mb-2">Ports of Call:</h4>
          <div className="flex flex-wrap gap-2">
            {offer.cruise_ports.slice(0, 5).map((port, i) => (
              <span key={i} className="bg-blue-50 text-blue-700 text-xs px-3 py-1.5 rounded-full border border-blue-200">
                {port}
              </span>
            ))}
            {offer.cruise_ports.length > 5 && (
              <span className="text-xs text-gray-500 px-2 py-1.5">
                +{offer.cruise_ports.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Itinerary Preview */}
      {offer.cruise_itinerary && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 line-clamp-2">{offer.cruise_itinerary}</p>
        </div>
      )}

      {/* View Deal Button */}
      <button
        onClick={handleViewDeal}
        className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center gap-2"
      >
        <Anchor size={18} /> View Cruise Deal
        <ArrowRight size={18} />
      </button>
    </div>
  );
};

export default CruiseOfferCard;

