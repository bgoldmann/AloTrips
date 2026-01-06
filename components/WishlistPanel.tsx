'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Trash2, Search, X } from 'lucide-react';
import { Offer, Vertical } from '@/types';
import OfferCard from './OfferCard';
import ActivityOfferCard from './ActivityOfferCard';
import CruiseOfferCard from './CruiseOfferCard';
import PackageOfferCard from './PackageOfferCard';

interface WishlistPanelProps {
  userId?: string;
  onClose?: () => void;
}

const WishlistPanel: React.FC<WishlistPanelProps> = ({ userId, onClose }) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Vertical | 'all'>('all');

  useEffect(() => {
    loadWishlist();
  }, [userId, filter]);

  const loadWishlist = async () => {
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') {
        params.append('vertical', filter);
      }
      
      const response = await fetch(`/api/wishlist?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setOffers(data.offers || []);
      }
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (offerId: string) => {
    try {
      const response = await fetch(`/api/wishlist?offer_id=${offerId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadWishlist();
      }
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

  const verticals: (Vertical | 'all')[] = ['all', 'stays', 'flights', 'cars', 'packages', 'cruises', 'things-to-do'];
  const filteredOffers = filter === 'all' 
    ? offers 
    : offers.filter(o => o.vertical === filter);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-h-[80vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Heart size={24} className="text-red-500 fill-red-500" />
          <h2 className="text-2xl font-bold text-gray-900">My Wishlist</h2>
          {offers.length > 0 && (
            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold">
              {offers.length}
            </span>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close wishlist"
          >
            <X size={20} className="text-gray-500" />
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {verticals.map((v) => (
          <button
            key={v}
            onClick={() => setFilter(v)}
            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
              filter === v
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {v === 'all' ? 'All' : v.charAt(0).toUpperCase() + v.slice(1)}
            {v !== 'all' && (
              <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                {offers.filter(o => o.vertical === v).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Wishlist Items */}
      {filteredOffers.length === 0 ? (
        <div className="text-center py-12">
          <Heart size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {filter === 'all' ? 'Your wishlist is empty' : `No ${filter} in wishlist`}
          </h3>
          <p className="text-gray-500 text-sm">
            {filter === 'all' 
              ? 'Start saving offers you love by clicking the heart icon on any deal'
              : `Try saving some ${filter} offers to your wishlist`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOffers.map((offer) => {
            const OfferComponent = 
              offer.vertical === 'things-to-do' ? ActivityOfferCard :
              offer.vertical === 'cruises' ? CruiseOfferCard :
              offer.vertical === 'packages' ? PackageOfferCard :
              OfferCard;

            return (
              <div key={offer.id} className="relative group">
                <button
                  onClick={() => removeFromWishlist(offer.id)}
                  className="absolute top-4 right-4 z-50 p-2 bg-white rounded-lg shadow-md hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 size={18} />
                </button>
                <OfferComponent offer={offer} vertical={offer.vertical} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WishlistPanel;

