'use client';

import React, { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck, Trash2, Search, Star, StarOff } from 'lucide-react';
import { Vertical, SearchParams } from '@/types';

interface SavedTrip {
  id: string;
  name: string;
  vertical: Vertical;
  search_params: SearchParams;
  flight_segments?: any;
  flexible_days?: number;
  notes?: string;
  tags?: string[];
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

interface SavedTripsPanelProps {
  userId?: string;
  onLoadTrip?: (trip: SavedTrip) => void;
}

const SavedTripsPanel: React.FC<SavedTripsPanelProps> = ({ userId = 'u_12345', onLoadTrip }) => {
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadTrips();
  }, [userId]);

  const loadTrips = async () => {
    try {
      const response = await fetch(`/api/trips/saved?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setTrips(data.trips || []);
      }
    } catch (error) {
      console.error('Failed to load trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveCurrentTrip = async (
    name: string,
    vertical: Vertical,
    searchParams: SearchParams,
    flightSegments?: any,
    flexibleDays?: number
  ) => {
    setSaving(true);
    try {
      const response = await fetch('/api/trips/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          name,
          vertical,
          searchParams,
          flightSegments,
          flexibleDays,
        }),
      });

      if (response.ok) {
        await loadTrips();
      }
    } catch (error) {
      console.error('Failed to save trip:', error);
    } finally {
      setSaving(false);
    }
  };

  const deleteTrip = async (id: string) => {
    if (!confirm('Are you sure you want to delete this saved trip?')) return;

    try {
      const response = await fetch(`/api/trips/saved?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadTrips();
      }
    } catch (error) {
      console.error('Failed to delete trip:', error);
    }
  };

  const toggleFavorite = async (trip: SavedTrip) => {
    try {
      const response = await fetch('/api/trips/saved', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: trip.id,
          isFavorite: !trip.is_favorite,
        }),
      });

      if (response.ok) {
        await loadTrips();
      }
    } catch (error) {
      console.error('Failed to update favorite:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="h-20 bg-gray-100 rounded"></div>
          <div className="h-20 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Bookmark size={20} className="text-orange-600" />
          Saved Trips
        </h3>
        <span className="text-sm text-gray-500">{trips.length}</span>
      </div>

      {trips.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Bookmark size={48} className="mx-auto mb-3 text-gray-300" />
          <p className="text-sm">No saved trips yet</p>
          <p className="text-xs mt-1">Save your searches to access them later</p>
        </div>
      ) : (
        <div className="space-y-3">
          {trips
            .sort((a, b) => (b.is_favorite ? 1 : 0) - (a.is_favorite ? 1 : 0))
            .map((trip) => (
              <div
                key={trip.id}
                className={`p-4 rounded-xl border transition-all ${
                  trip.is_favorite
                    ? 'bg-orange-50 border-orange-200'
                    : 'bg-gray-50 border-gray-200 hover:border-orange-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-gray-900">{trip.name}</h4>
                      {trip.is_favorite && (
                        <Star size={14} className="text-orange-500 fill-orange-500" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 capitalize mb-1">
                      {trip.vertical} • {trip.search_params.destination}
                    </p>
                    {trip.flexible_days && trip.flexible_days > 0 && (
                      <p className="text-xs text-orange-600 font-semibold">
                        ±{trip.flexible_days} days flexible
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleFavorite(trip)}
                      className="p-1.5 hover:bg-orange-100 rounded-lg transition-colors"
                      aria-label={trip.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      {trip.is_favorite ? (
                        <Star size={16} className="text-orange-500 fill-orange-500" />
                      ) : (
                        <StarOff size={16} className="text-gray-400" />
                      )}
                    </button>
                    {onLoadTrip && (
                      <button
                        onClick={() => onLoadTrip(trip)}
                        className="p-1.5 hover:bg-orange-100 rounded-lg transition-colors"
                        aria-label="Load trip"
                      >
                        <Search size={16} className="text-orange-600" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteTrip(trip.id)}
                      className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Delete trip"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default SavedTripsPanel;

