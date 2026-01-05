'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Offer, Vertical } from '@/types';
import { MapPin } from 'lucide-react';

interface MapViewProps {
  offers: Offer[];
  vertical: Vertical;
  onMarkerClick?: (offer: Offer) => void;
  selectedOfferId?: string;
}

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  offer: Offer;
}

/**
 * MapView component using a simple map placeholder
 * In production, this would integrate with Google Maps, Mapbox, or similar
 * For MVP, we show a styled placeholder with markers
 */
const MapView: React.FC<MapViewProps> = ({
  offers,
  vertical,
  onMarkerClick,
  selectedOfferId,
}) => {
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 }); // Default: NYC
  const mapRef = useRef<HTMLDivElement>(null);

  // Generate coordinates for offers
  useEffect(() => {
    if (offers.length === 0) return;

    // Generate markers - use actual coordinates if available (for activities), otherwise generate mock
    const generatedMarkers: MapMarker[] = offers.map((offer, index) => {
      // For activities, use actual lat/lng if available
      if (vertical === 'things-to-do' && offer.latitude && offer.longitude) {
        return {
          id: offer.id,
          lat: offer.latitude,
          lng: offer.longitude,
          offer,
        };
      }
      
      // For stays, use actual coordinates if available (from property data)
      if (vertical === 'stays' && offer.latitude && offer.longitude) {
        return {
          id: offer.id,
          lat: offer.latitude,
          lng: offer.longitude,
          offer,
        };
      }
      
      // Otherwise, generate mock coordinates around center point
      const baseLat = mapCenter.lat;
      const baseLng = mapCenter.lng;
      const offset = 0.05; // ~5km spread
      
      return {
        id: offer.id,
        lat: baseLat + (Math.random() - 0.5) * offset,
        lng: baseLng + (Math.random() - 0.5) * offset,
        offer,
      };
    });

    setMarkers(generatedMarkers);

    // Center map on first offer or average of all offers
    if (generatedMarkers.length > 0) {
      const avgLat = generatedMarkers.reduce((sum, m) => sum + m.lat, 0) / generatedMarkers.length;
      const avgLng = generatedMarkers.reduce((sum, m) => sum + m.lng, 0) / generatedMarkers.length;
      setMapCenter({ lat: avgLat, lng: avgLng });
    }
  }, [offers, mapCenter.lat, mapCenter.lng]);

  const handleMarkerClick = (marker: MapMarker) => {
    if (onMarkerClick) {
      onMarkerClick(marker.offer);
    }
  };

  // Calculate marker position as percentage (for CSS positioning)
  const getMarkerPosition = (marker: MapMarker) => {
    if (markers.length === 0) return { top: '50%', left: '50%' };
    
    // Find min/max bounds
    const lats = markers.map(m => m.lat);
    const lngs = markers.map(m => m.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    
    // Normalize to 0-100%
    const latRange = maxLat - minLat || 1;
    const lngRange = maxLng - minLng || 1;
    
    const top = ((marker.lat - minLat) / latRange) * 100;
    const left = ((marker.lng - minLng) / lngRange) * 100;
    
    return {
      top: `${Math.max(5, Math.min(95, top))}%`,
      left: `${Math.max(5, Math.min(95, left))}%`,
    };
  };

  if (offers.length === 0) {
    return (
      <div className="h-full w-full bg-gray-100 rounded-xl flex items-center justify-center">
        <p className="text-gray-500">No locations to display</p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full bg-gray-100 rounded-xl overflow-hidden">
      {/* Map placeholder - in production, this would be a real map */}
      <div 
        ref={mapRef}
        className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50"
        style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)',
        }}
      >
        {/* Map grid pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        />
      </div>

      {/* Markers */}
      {markers.map((marker) => {
        const position = getMarkerPosition(marker);
        const isSelected = marker.id === selectedOfferId;
        const isCheapest = marker.offer.isCheapest;
        const isBestValue = marker.offer.isBestValue;

        return (
          <button
            key={marker.id}
            onClick={() => handleMarkerClick(marker)}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all z-10 ${
              isSelected ? 'z-20 scale-125' : 'hover:scale-110'
            }`}
            style={position}
            aria-label={`View ${marker.offer.title}`}
          >
            <div className="relative">
              {/* Marker pin */}
              <div
                className={`w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${
                  isSelected
                    ? 'bg-orange-600'
                    : isCheapest
                    ? 'bg-red-500'
                    : isBestValue
                    ? 'bg-blue-500'
                    : 'bg-orange-500'
                }`}
              >
                <MapPin size={16} className="text-white" />
              </div>
              
              {/* Price badge */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                <div className="bg-white px-2 py-1 rounded shadow text-xs font-bold text-gray-900">
                  ${Math.round(marker.offer.total_price)}
                </div>
              </div>
            </div>
          </button>
        );
      })}

      {/* Map controls placeholder */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-50 transition">
          <span className="text-lg">+</span>
        </button>
        <button className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-50 transition">
          <span className="text-lg">−</span>
        </button>
      </div>

      {/* Info overlay */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md">
        <p className="text-xs text-gray-600">
          {markers.length} {vertical === 'stays' ? 'properties' : vertical === 'cars' ? 'locations' : 'options'} shown
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Click markers to view details
        </p>
      </div>
    </div>
  );
};

export default MapView;

