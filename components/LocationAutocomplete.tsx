'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MapPin, X } from 'lucide-react';
import { searchLocations, Location, formatLocation } from '@/lib/locations';

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  type?: 'airport' | 'city';
  required?: boolean;
  error?: string;
}

const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  value,
  onChange,
  placeholder = 'Enter location',
  label,
  type,
  required = false,
  error,
}) => {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update query when value prop changes
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    onChange(newQuery);

    if (newQuery.length >= 2) {
      const results = searchLocations(newQuery, type);
      setSuggestions(results);
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  };

  const handleSelectLocation = (location: Location) => {
    setSelectedLocation(location);
    setQuery(formatLocation(location));
    onChange(location.code);
    setIsOpen(false);
    setSuggestions([]);
  };

  const handleClear = () => {
    setQuery('');
    onChange('');
    setSelectedLocation(null);
    setIsOpen(false);
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    if (query.length >= 2) {
      const results = searchLocations(query, type);
      setSuggestions(results);
      setIsOpen(true);
    } else if (query.length === 0) {
      // Show popular locations when empty
      const results = searchLocations('', type);
      setSuggestions(results);
      setIsOpen(true);
    }
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && (
        <label className="absolute left-11 top-3 text-xs text-gray-500 font-bold uppercase tracking-wider z-10 pointer-events-none">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <MapPin className="absolute left-4 top-4.5 text-gray-400 pointer-events-none z-10" size={20} />
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          required={required}
          className={`w-full h-16 pl-11 pr-10 pt-5 rounded-2xl border ${
            error ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'
          } focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none font-bold text-gray-900 text-lg transition-all shadow-inner`}
        />
        
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {error && (
        <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>
      )}

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl max-h-80 overflow-y-auto">
          {suggestions.map((location) => (
            <button
              key={`${location.code}-${location.type}`}
              type="button"
              onClick={() => handleSelectLocation(location)}
              className="w-full text-left px-4 py-3 hover:bg-orange-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                  <MapPin size={16} className="text-orange-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-900 text-sm">
                    {location.type === 'airport' ? location.code : location.name}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {location.type === 'airport' 
                      ? `${location.name}, ${location.city}`
                      : `${location.city}, ${location.country}`
                    }
                  </div>
                </div>
                {location.type === 'airport' && (
                  <div className="flex-shrink-0 text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded">
                    Airport
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationAutocomplete;

