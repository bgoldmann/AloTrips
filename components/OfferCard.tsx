'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Offer, Vertical } from '../types';
import { Flame, Star, ShoppingBag, Clock, ShieldCheck, MapPin, Heart, Car, Users, Gauge, ArrowRight, Plane, Luggage } from 'lucide-react';
import { useTracking } from '@/hooks/useTracking';
import { getCurrencySymbol } from '@/lib/currency';

interface OfferCardProps {
  offer: Offer;
  vertical: Vertical;
}

const OfferCard: React.FC<OfferCardProps> = ({ offer, vertical }) => {
  const [isSaved, setIsSaved] = useState(false);
  const currencySymbol = getCurrencySymbol(offer.currency as any);
  const { trackRedirect } = useTracking();

  const handleViewDeal = () => {
    // Extract route/destination from offer title if available
    const routeMatch = offer.title.match(/(.+?)\s*→\s*(.+)/);
    const routeOrDestination = routeMatch 
      ? `${routeMatch[1]}-${routeMatch[2]}`.replace(/\s+/g, '-').toLowerCase()
      : undefined;

    const { url } = trackRedirect(
      vertical,
      offer.provider,
      'results_row',
      routeOrDestination
    );

    // Open in new tab
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
      
      {/* Badges */}
      <div className="absolute top-0 left-0 flex flex-col gap-0.5 z-30 pointer-events-none">
        {offer.isCheapest && (
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] uppercase font-black px-3 py-1.5 rounded-br-xl shadow-lg flex items-center gap-1.5 tracking-wide">
            <Flame size={12} className="fill-current animate-pulse" /> CHEAPEST
          </div>
        )}
        {offer.isBestValue && (
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-[10px] uppercase font-black px-3 py-1.5 rounded-br-xl shadow-lg flex items-center gap-1.5 tracking-wide mt-0.5">
            <Star size={12} className="fill-current" /> BEST VALUE
          </div>
        )}
      </div>

      {/* Save Button */}
      <button 
        onClick={() => setIsSaved(!isSaved)}
        className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-white/90 hover:bg-white text-gray-400 hover:text-red-500 transition-all shadow-sm backdrop-blur-md group-hover:scale-110 active:scale-90"
        aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart size={20} className={isSaved ? "fill-red-500 text-red-500 transition-colors" : "transition-colors"} />
      </button>

      <div className="flex flex-col md:flex-row gap-5">
        {/* Image / Thumbnail */}
        <div className="w-full md:w-56 h-40 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden relative shadow-inner">
          <Image 
            src={offer.image} 
            alt={offer.title} 
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
            sizes="(max-width: 768px) 100vw, 224px"
            unoptimized={offer.image?.includes('picsum.photos')}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between py-1">
          <div>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-gray-900 text-lg pr-8 leading-tight group-hover:text-orange-600 transition-colors">{offer.title}</h3>
                <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1 font-medium">
                  {vertical === 'stays' ? <MapPin size={14} className="text-orange-400"/> : null}
                  {offer.subtitle}
                </p>
              </div>
              <div className="flex items-center gap-1.5 bg-orange-50 px-2.5 py-1 rounded-lg text-orange-700 text-xs font-bold border border-orange-100">
                {offer.rating} <span className="text-[10px] font-medium text-orange-400">/ 5 ({offer.reviewCount})</span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="mt-4 grid grid-cols-2 gap-y-2.5 gap-x-4 text-sm text-gray-600">
              
              {/* Flight Specific Layout */}
              {vertical === 'flights' && (
                <div className="col-span-2 mt-1">
                   {/* Flight Timeline Card */}
                   <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex flex-col gap-3">
                      
                      {/* Times and Duration */}
                      <div className="flex items-center justify-between">
                         <div className="flex flex-col">
                            <span className="text-xl font-black text-gray-900 leading-none">{offer.departure_time || '10:00'}</span>
                            <span className="text-[10px] font-bold text-gray-500 uppercase mt-1">JFK • New York</span>
                         </div>
                         
                         <div className="flex-1 px-6 flex flex-col items-center">
                            <span className="text-[10px] text-gray-500 font-medium mb-1">{offer.duration}</span>
                            <div className="w-full h-0.5 bg-gray-300 relative flex items-center justify-center">
                               <div className="absolute bg-white p-1 rounded-full border border-gray-200">
                                  <Plane size={10} className="text-orange-500 fill-current rotate-90" />
                               </div>
                            </div>
                            <span className="text-[10px] text-orange-600 font-bold mt-1">
                               {offer.stops === 0 ? 'Non-stop' : `${offer.stops ?? 0} Stop${(offer.stops ?? 0) > 1 ? 's' : ''}`}
                            </span>
                         </div>

                         <div className="flex flex-col items-end">
                            <span className="text-xl font-black text-gray-900 leading-none">{offer.arrival_time || '17:00'}</span>
                            <span className="text-[10px] font-bold text-gray-500 uppercase mt-1">LHR • London</span>
                         </div>
                      </div>

                      {/* Flight Meta Info */}
                      <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                         <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                               <span className="text-xs font-bold text-gray-900">{offer.subtitle}</span>
                               <span className="text-[10px] text-gray-500 font-mono">{offer.flight_number || 'FL123'}</span>
                            </div>
                         </div>

                         <div className="flex items-center gap-2">
                            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border ${offer.baggage_included ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'}`}>
                               <Luggage size={12} />
                               <span className="text-[10px] font-bold uppercase tracking-wide">
                                  {offer.baggage_included ? 'Bag Included' : 'No Checked Bag'}
                               </span>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {/* Stays Specific Layout */}
              {vertical === 'stays' && (
                <>
                  <div className="flex items-center gap-2.5">
                    <Star size={16} className="text-yellow-400 fill-yellow-400"/> 
                    <span className="font-medium">{offer.stars}-Star Hotel</span>
                  </div>
                   <div className="flex items-center gap-2">
                     <div className="flex gap-2">
                        {offer.amenities?.slice(0, 2).map(a => (
                            <span key={a} className="bg-gray-50 border border-gray-100 px-2 py-0.5 rounded text-xs text-gray-600 font-medium">{a}</span>
                        ))}
                     </div>
                   </div>
                </>
              )}

              {/* Cars Specific Layout */}
              {vertical === 'cars' && (
                 <div className="col-span-2 bg-orange-50/50 rounded-xl p-3 border border-orange-100 mb-1">
                   <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2.5">
                         <div className="bg-white p-1.5 rounded-lg shadow-sm border border-orange-100">
                             <Car size={16} className="text-orange-500" />
                         </div>
                         <div>
                             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Class</p>
                             <p className="text-sm font-bold text-gray-900 leading-tight">{offer.car_type || 'Standard'}</p>
                             <p className="text-[10px] text-gray-500">{offer.transmission || 'Automatic'}</p>
                         </div>
                      </div>
                      
                      <div className="flex items-center gap-2.5">
                         <div className="bg-white p-1.5 rounded-lg shadow-sm border border-orange-100">
                             <Users size={16} className="text-orange-500" />
                         </div>
                         <div>
                             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Capacity</p>
                             <p className="text-sm font-bold text-gray-900 leading-tight">{offer.passengers || 4} Seats</p>
                         </div>
                      </div>

                      <div className="col-span-2 flex items-center gap-2 border-t border-orange-100 pt-2.5 mt-0.5">
                          <Gauge size={14} className="text-orange-500" />
                          <span className="text-xs text-gray-600 font-medium">
                            Mileage: <span className="font-bold text-gray-900">{offer.mileage_limit || 'Unlimited'}</span>
                          </span>
                          
                          {offer.amenities && (
                             <div className="ml-auto flex gap-1">
                                {offer.amenities.slice(0, 2).map((a, i) => (
                                   <span key={i} className="text-[10px] bg-white border border-gray-200 px-1.5 py-0.5 rounded text-gray-500">{a}</span>
                                ))}
                             </div>
                          )}
                      </div>
                   </div>
                </div>
              )}
              
              {offer.refundable && (
                <div className="flex items-center gap-2 text-emerald-600 col-span-2 mt-1">
                   <ShieldCheck size={16} className="text-emerald-500"/> <span className="text-xs font-bold uppercase tracking-wide">Free Cancellation</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex flex-row md:flex-col justify-between items-end border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 mt-4 md:mt-0 w-full md:w-44 shrink-0">
           <div className="text-right w-full md:w-auto flex justify-between md:block items-center">
              <span className="text-xs text-gray-400 block mb-1 font-medium">Total Price</span>
              <div>
                  <span className="text-2xl font-black text-gray-900 tracking-tight">{currencySymbol}{Math.round(offer.total_price)}</span>
                  <span className="text-[10px] text-gray-400 block mt-0.5">via {offer.provider}</span>
              </div>
           </div>
           
           <button 
             onClick={handleViewDeal}
             className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-2.5 px-4 rounded-xl w-full mt-3 transition-all shadow-md hover:shadow-orange-200 hover:-translate-y-0.5 flex items-center justify-center gap-2 group/btn"
           >
             View Deal <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform"/>
           </button>
        </div>
      </div>
    </div>
  );
};

export default OfferCard;