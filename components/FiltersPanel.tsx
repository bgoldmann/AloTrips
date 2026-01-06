'use client';

import React, { useState } from 'react';
import { Vertical, FilterState } from '@/types';
import { X, Sliders } from 'lucide-react';

interface FiltersPanelProps {
  vertical: Vertical;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClear: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const FiltersPanel: React.FC<FiltersPanelProps> = ({
  vertical,
  filters,
  onFiltersChange,
  onClear,
  isOpen,
  onClose,
}) => {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  // Sync local filters when props change
  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const updateFilter = (updates: Partial<FilterState>) => {
    const newFilters = { ...localFilters, ...updates };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClear = () => {
    const cleared: FilterState = {};
    setLocalFilters(cleared);
    onClear();
  };

  const activeFilterCount = Object.keys(filters).filter(
    key => filters[key as keyof FilterState] !== undefined && 
           (Array.isArray(filters[key as keyof FilterState]) 
             ? (filters[key as keyof FilterState] as any[]).length > 0
             : true)
  ).length;

  if (!isOpen) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Sliders size={20} className="text-orange-500" />
          <h3 className="font-bold text-gray-900 text-lg">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-full">
              {activeFilterCount} active
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button
              onClick={handleClear}
              className="text-sm font-bold text-gray-600 hover:text-orange-600 transition-colors"
            >
              Clear all
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close filters panel"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Price Range Filter (All verticals) */}
        <div>
          <h4 className="text-sm font-bold text-gray-700 mb-3">Price Range</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="filter-min-price" className="text-xs text-gray-500 mb-1 block">Min Price</label>
              <input
                id="filter-min-price"
                type="number"
                value={localFilters.minPrice || ''}
                onChange={(e) => updateFilter({ minPrice: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="$0"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none"
              />
            </div>
            <div>
              <label htmlFor="filter-max-price" className="text-xs text-gray-500 mb-1 block">Max Price</label>
              <input
                id="filter-max-price"
                type="number"
                value={localFilters.maxPrice || ''}
                onChange={(e) => updateFilter({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="$1000"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Flight-specific Filters */}
        {vertical === 'flights' && (
          <>
            <div>
              <h4 className="text-sm font-bold text-gray-700 mb-3">Stops</h4>
              <div className="flex flex-wrap gap-2">
                {[0, 1, 2].map((stops) => (
                  <button
                    key={stops}
                    onClick={() => updateFilter({ maxStops: localFilters.maxStops === stops ? undefined : stops })}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                      localFilters.maxStops === stops
                        ? 'bg-orange-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {stops === 0 ? 'Non-stop' : stops === 1 ? '1 Stop' : '2+ Stops'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-gray-700 mb-3">Departure Time</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="filter-departure-time-start" className="text-xs text-gray-500 mb-1 block">From</label>
                  <input
                    id="filter-departure-time-start"
                    type="time"
                    value={localFilters.departureTimeStart || ''}
                    onChange={(e) => updateFilter({ departureTimeStart: e.target.value || undefined })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="filter-departure-time-end" className="text-xs text-gray-500 mb-1 block">To</label>
                  <input
                    id="filter-departure-time-end"
                    type="time"
                    value={localFilters.departureTimeEnd || ''}
                    onChange={(e) => updateFilter({ departureTimeEnd: e.target.value || undefined })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Stays-specific Filters */}
        {vertical === 'stays' && (
          <>
            <div>
              <h4 className="text-sm font-bold text-gray-700 mb-3">Star Rating</h4>
              <div className="flex flex-wrap gap-2">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <button
                    key={stars}
                    onClick={() => updateFilter({ minStars: localFilters.minStars === stars ? undefined : stars })}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                      localFilters.minStars === stars
                        ? 'bg-orange-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {'⭐'.repeat(stars)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-gray-700 mb-3">Guest Rating</h4>
              <div className="flex items-center gap-3">
                <label htmlFor="filter-min-rating-stays" className="sr-only">Minimum guest rating</label>
                <input
                  id="filter-min-rating-stays"
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={localFilters.minRating || 0}
                  onChange={(e) => updateFilter({ minRating: Number(e.target.value) || undefined })}
                  className="flex-1 accent-orange-500"
                  aria-label="Minimum guest rating"
                />
                <span className="text-sm font-bold text-gray-700 min-w-[3rem] text-right" aria-live="polite">
                  {localFilters.minRating ? localFilters.minRating.toFixed(1) : 'Any'}
                </span>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localFilters.refundable || false}
                  onChange={(e) => updateFilter({ refundable: e.target.checked || undefined })}
                  className="w-5 h-5 rounded text-orange-600 focus:ring-orange-500 border-gray-300"
                />
                <span className="text-sm font-bold text-gray-700">Free Cancellation</span>
              </label>
            </div>

            <div>
              <h4 className="text-sm font-bold text-gray-700 mb-3">Amenities</h4>
              <div className="space-y-2">
                {['Wifi', 'Pool', 'Gym', 'Parking', 'Breakfast', 'Pet Friendly'].map((amenity) => {
                  const isSelected = localFilters.amenities?.includes(amenity);
                  return (
                    <label key={amenity} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isSelected || false}
                        onChange={(e) => {
                          const current = localFilters.amenities || [];
                          const updated = e.target.checked
                            ? [...current, amenity]
                            : current.filter(a => a !== amenity);
                          updateFilter({ amenities: updated.length > 0 ? updated : undefined });
                        }}
                        className="w-5 h-5 rounded text-orange-600 focus:ring-orange-500 border-gray-300"
                      />
                      <span className="text-sm text-gray-700">{amenity}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Car-specific Filters */}
        {vertical === 'cars' && (
          <>
            <div>
              <h4 className="text-sm font-bold text-gray-700 mb-3">Car Class</h4>
              <div className="flex flex-wrap gap-2">
                {['Economy', 'Intermediate', 'Standard', 'Full Size', 'SUV', 'Luxury'].map((carClass) => {
                  const isSelected = localFilters.carClass?.includes(carClass);
                  return (
                    <button
                      key={carClass}
                      onClick={() => {
                        const current = localFilters.carClass || [];
                        const updated = isSelected
                          ? current.filter(c => c !== carClass)
                          : [...current, carClass];
                        updateFilter({ carClass: updated.length > 0 ? updated : undefined });
                      }}
                      className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                        isSelected
                          ? 'bg-orange-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {carClass}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-gray-700 mb-3">Transmission</h4>
              <div className="flex flex-wrap gap-2">
                {['Automatic', 'Manual'].map((transmission) => {
                  const isSelected = localFilters.transmission?.includes(transmission);
                  return (
                    <button
                      key={transmission}
                      onClick={() => {
                        const current = localFilters.transmission || [];
                        const updated = isSelected
                          ? current.filter(t => t !== transmission)
                          : [...current, transmission];
                        updateFilter({ transmission: updated.length > 0 ? updated : undefined });
                      }}
                      className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                        isSelected
                          ? 'bg-orange-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {transmission}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localFilters.unlimitedMileage || false}
                  onChange={(e) => updateFilter({ unlimitedMileage: e.target.checked || undefined })}
                  className="w-5 h-5 rounded text-orange-600 focus:ring-orange-500 border-gray-300"
                />
                <span className="text-sm font-bold text-gray-700">Unlimited Mileage</span>
              </label>
            </div>
          </>
        )}

        {/* Things to Do / Activities Filters */}
        {vertical === 'things-to-do' && (
          <>
            <div>
              <h4 className="text-sm font-bold text-gray-700 mb-3">Category</h4>
              <div className="flex flex-wrap gap-2">
                {['Tours', 'Attractions', 'Experiences', 'Adventures', 'Cultural', 'Food & Drink', 'Entertainment'].map((category) => {
                  const isSelected = localFilters.activityCategory?.includes(category);
                  return (
                    <button
                      key={category}
                      onClick={() => {
                        const current = localFilters.activityCategory || [];
                        const updated = isSelected
                          ? current.filter(c => c !== category)
                          : [...current, category];
                        updateFilter({ activityCategory: updated.length > 0 ? updated : undefined });
                      }}
                      className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                        isSelected
                          ? 'bg-orange-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-gray-700 mb-3">Duration</h4>
              <div className="flex flex-wrap gap-2">
                {['short', 'half-day', 'full-day'].map((duration) => {
                  const isSelected = localFilters.activityDuration?.includes(duration);
                  return (
                    <button
                      key={duration}
                      onClick={() => {
                        const current = localFilters.activityDuration || [];
                        const updated = isSelected
                          ? current.filter(d => d !== duration)
                          : [...current, duration];
                        updateFilter({ activityDuration: updated.length > 0 ? updated : undefined });
                      }}
                      className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                        isSelected
                          ? 'bg-orange-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {duration === 'short' ? 'Short (< 3 hours)' : duration === 'half-day' ? 'Half Day (3-6 hours)' : 'Full Day (6+ hours)'}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-gray-700 mb-3">Guest Rating</h4>
              <div className="flex items-center gap-3">
                <label htmlFor="filter-min-rating-activities" className="sr-only">Minimum guest rating</label>
                <input
                  id="filter-min-rating-activities"
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={localFilters.minRating || 0}
                  onChange={(e) => updateFilter({ minRating: Number(e.target.value) || undefined })}
                  className="flex-1 accent-orange-500"
                  aria-label="Minimum guest rating"
                />
                <span className="text-sm font-bold text-gray-700 min-w-[3rem] text-right" aria-live="polite">
                  {localFilters.minRating ? localFilters.minRating.toFixed(1) : 'Any'}
                </span>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localFilters.refundable || false}
                  onChange={(e) => updateFilter({ refundable: e.target.checked || undefined })}
                  className="w-5 h-5 rounded text-orange-600 focus:ring-orange-500 border-gray-300"
                />
                <span className="text-sm font-bold text-gray-700">Free Cancellation</span>
              </label>
            </div>
          </>
        )}

        {/* Cruises-specific Filters */}
        {vertical === 'cruises' && (
          <>
            <div>
              <h4 className="text-sm font-bold text-gray-700 mb-3">Cruise Line</h4>
              <div className="flex flex-wrap gap-2">
                {['Royal Caribbean', 'Carnival', 'Norwegian', 'Princess', 'Celebrity', 'MSC', 'Holland America'].map((line) => {
                  const isSelected = localFilters.cruiseLines?.includes(line);
                  return (
                    <button
                      key={line}
                      onClick={() => {
                        const current = localFilters.cruiseLines || [];
                        const updated = isSelected
                          ? current.filter(l => l !== line)
                          : [...current, line];
                        updateFilter({ cruiseLines: updated.length > 0 ? updated : undefined });
                      }}
                      className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {line}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-gray-700 mb-3">Region</h4>
              <div className="flex flex-wrap gap-2">
                {['Caribbean', 'Mediterranean', 'Alaska', 'Bahamas', 'Mexican Riviera', 'Northern Europe', 'Asia'].map((region) => {
                  const isSelected = localFilters.cruiseRegions?.includes(region);
                  return (
                    <button
                      key={region}
                      onClick={() => {
                        const current = localFilters.cruiseRegions || [];
                        const updated = isSelected
                          ? current.filter(r => r !== region)
                          : [...current, region];
                        updateFilter({ cruiseRegions: updated.length > 0 ? updated : undefined });
                      }}
                      className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {region}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-gray-700 mb-3">Duration (Nights)</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="filter-cruise-duration-min" className="text-xs text-gray-500 mb-1 block">Min</label>
                  <input
                    id="filter-cruise-duration-min"
                    type="number"
                    min="1"
                    value={localFilters.cruiseDurationMin || ''}
                    onChange={(e) => updateFilter({ 
                      cruiseDurationMin: e.target.value ? Number(e.target.value) : undefined 
                    })}
                    placeholder="1"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="filter-cruise-duration-max" className="text-xs text-gray-500 mb-1 block">Max</label>
                  <input
                    id="filter-cruise-duration-max"
                    type="number"
                    min="1"
                    value={localFilters.cruiseDurationMax || ''}
                    onChange={(e) => updateFilter({ 
                      cruiseDurationMax: e.target.value ? Number(e.target.value) : undefined 
                    })}
                    placeholder="14"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-gray-700 mb-3">Cabin Type</h4>
              <div className="flex flex-wrap gap-2">
                {['Interior', 'Ocean View', 'Balcony', 'Suite'].map((cabin) => {
                  const isSelected = localFilters.cruiseCabinType?.includes(cabin);
                  return (
                    <button
                      key={cabin}
                      onClick={() => {
                        const current = localFilters.cruiseCabinType || [];
                        const updated = isSelected
                          ? current.filter(c => c !== cabin)
                          : [...current, cabin];
                        updateFilter({ cruiseCabinType: updated.length > 0 ? updated : undefined });
                      }}
                      className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {cabin}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-gray-700 mb-3">Guest Rating</h4>
              <div className="flex items-center gap-3">
                <label htmlFor="filter-min-rating-cruises" className="sr-only">Minimum guest rating</label>
                <input
                  id="filter-min-rating-cruises"
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={localFilters.minRating || 0}
                  onChange={(e) => updateFilter({ minRating: Number(e.target.value) || undefined })}
                  className="flex-1 accent-blue-500"
                  aria-label="Minimum guest rating"
                />
                <span className="text-sm font-bold text-gray-700 min-w-[3rem] text-right" aria-live="polite">
                  {localFilters.minRating ? localFilters.minRating.toFixed(1) : 'Any'}
                </span>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localFilters.refundable || false}
                  onChange={(e) => updateFilter({ refundable: e.target.checked || undefined })}
                  className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="text-sm font-bold text-gray-700">Free Cancellation</span>
              </label>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FiltersPanel;

