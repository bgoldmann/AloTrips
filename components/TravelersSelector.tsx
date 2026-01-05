'use client';

import React, { useState } from 'react';
import { User, Users, Baby, Bed, ChevronDown, Plus, Minus } from 'lucide-react';

export interface TravelersConfig {
  adults: number;
  children: number;
  rooms: number;
}

interface TravelersSelectorProps {
  value: TravelersConfig;
  onChange: (config: TravelersConfig) => void;
  showRooms?: boolean;
  label?: string;
  error?: string;
}

const TravelersSelector: React.FC<TravelersSelectorProps> = ({
  value,
  onChange,
  showRooms = false,
  label = 'Travelers',
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const updateValue = (updates: Partial<TravelersConfig>) => {
    onChange({ ...value, ...updates });
  };

  const formatDisplay = () => {
    const parts: string[] = [];
    if (value.adults > 0) {
      parts.push(`${value.adults} ${value.adults === 1 ? 'adult' : 'adults'}`);
    }
    if (value.children > 0) {
      parts.push(`${value.children} ${value.children === 1 ? 'child' : 'children'}`);
    }
    if (showRooms && value.rooms > 0) {
      parts.push(`${value.rooms} ${value.rooms === 1 ? 'room' : 'rooms'}`);
    }
    return parts.length > 0 ? parts.join(', ') : 'Select travelers';
  };

  return (
    <div className="relative w-full">
      <label className="absolute left-11 top-3 text-xs text-gray-500 font-bold uppercase tracking-wider z-10 pointer-events-none">
        {label}
      </label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-16 pl-11 pr-10 pt-5 rounded-2xl border ${
          error ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'
        } focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none font-bold text-gray-900 text-lg transition-all shadow-inner text-left`}
      >
        <div className="flex items-center justify-between">
          <span className={value.adults === 0 && value.children === 0 ? 'text-gray-400' : ''}>
            {formatDisplay()}
          </span>
          <ChevronDown 
            size={20} 
            className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          />
        </div>
      </button>

      {error && (
        <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>
      )}

      {/* Dropdown */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl p-4 space-y-4">
            {/* Adults */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users size={20} className="text-orange-500" />
                <div>
                  <div className="font-bold text-gray-900">Adults</div>
                  <div className="text-xs text-gray-500">Age 18+</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => updateValue({ adults: Math.max(1, value.adults - 1) })}
                  disabled={value.adults <= 1}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-orange-50 hover:border-orange-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center font-bold text-gray-900">{value.adults}</span>
                <button
                  type="button"
                  onClick={() => updateValue({ adults: value.adults + 1 })}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-orange-50 hover:border-orange-300 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Children */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
              <div className="flex items-center gap-3">
                <Baby size={20} className="text-orange-500" />
                <div>
                  <div className="font-bold text-gray-900">Children</div>
                  <div className="text-xs text-gray-500">Ages 0-17</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => updateValue({ children: Math.max(0, value.children - 1) })}
                  disabled={value.children <= 0}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-orange-50 hover:border-orange-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center font-bold text-gray-900">{value.children}</span>
                <button
                  type="button"
                  onClick={() => updateValue({ children: value.children + 1 })}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-orange-50 hover:border-orange-300 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Rooms (for hotels) */}
            {showRooms && (
              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <div className="flex items-center gap-3">
                  <Bed size={20} className="text-orange-500" />
                  <div>
                    <div className="font-bold text-gray-900">Rooms</div>
                    <div className="text-xs text-gray-500">Number of rooms</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => updateValue({ rooms: Math.max(1, value.rooms - 1) })}
                    disabled={value.rooms <= 1}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-orange-50 hover:border-orange-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center font-bold text-gray-900">{value.rooms}</span>
                  <button
                    type="button"
                    onClick={() => updateValue({ rooms: value.rooms + 1 })}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-orange-50 hover:border-orange-300 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* Done Button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full mt-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-2.5 px-4 rounded-xl transition-all"
            >
              Done
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TravelersSelector;

