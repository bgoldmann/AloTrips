'use client';

import React, { useState } from 'react';
import { Plus, X, MapPin } from 'lucide-react';
import LocationAutocomplete from './LocationAutocomplete';

export interface FlightSegment {
  origin: string;
  destination: string;
  date: Date | null;
}

interface MultiCityFlightFormProps {
  segments: FlightSegment[];
  onChange: (segments: FlightSegment[]) => void;
  onDateChange: (index: number, date: Date | null) => void;
}

const MultiCityFlightForm: React.FC<MultiCityFlightFormProps> = ({
  segments,
  onChange,
  onDateChange,
}) => {
  const addSegment = () => {
    const lastSegment = segments[segments.length - 1];
    onChange([
      ...segments,
      {
        origin: lastSegment?.destination || '',
        destination: '',
        date: lastSegment?.date ? new Date(new Date(lastSegment.date).getTime() + 24 * 60 * 60 * 1000) : null,
      },
    ]);
  };

  const removeSegment = (index: number) => {
    if (segments.length > 1) {
      onChange(segments.filter((_, i) => i !== index));
    }
  };

  const updateSegment = (index: number, field: keyof FlightSegment, value: string | Date | null) => {
    const updated = [...segments];
    updated[index] = { ...updated[index], [field]: value };
    
    // Auto-fill next segment's origin with current destination
    if (field === 'destination' && index < segments.length - 1) {
      updated[index + 1] = { ...updated[index + 1], origin: value as string };
    }
    
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {segments.map((segment, index) => (
        <div key={index} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center text-sm">
                {index + 1}
              </div>
              <span className="font-bold text-gray-700">Flight {index + 1}</span>
            </div>
            {segments.length > 1 && (
              <button
                onClick={() => removeSegment(index)}
                className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition-colors"
                aria-label={`Remove flight ${index + 1}`}
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <LocationAutocomplete
                value={segment.origin}
                onChange={(value) => updateSegment(index, 'origin', value)}
                placeholder="From?"
                label="From"
                type="airport"
                required
              />
            </div>

            <div>
              <LocationAutocomplete
                value={segment.destination}
                onChange={(value) => updateSegment(index, 'destination', value)}
                placeholder="To?"
                label="To"
                type="airport"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                Date
              </label>
              <input
                type="date"
                value={segment.date ? segment.date.toISOString().split('T')[0] : ''}
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value) : null;
                  onDateChange(index, date);
                }}
                min={new Date().toISOString().split('T')[0]}
                className="w-full h-12 px-4 rounded-2xl border border-gray-200 bg-gray-50 text-gray-900 font-bold text-lg focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all"
                required
              />
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addSegment}
        className="w-full py-3 px-4 bg-orange-50 hover:bg-orange-100 border-2 border-dashed border-orange-300 rounded-2xl text-orange-600 font-bold flex items-center justify-center gap-2 transition-colors"
      >
        <Plus size={20} />
        Add Another Flight
      </button>
    </div>
  );
};

export default MultiCityFlightForm;

