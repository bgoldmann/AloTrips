'use client';

import React from 'react';
import { Plane, ArrowRight, MapPin } from 'lucide-react';

export type TripType = 'round-trip' | 'one-way' | 'multi-city';

interface TripTypeSelectorProps {
  value: TripType;
  onChange: (type: TripType) => void;
}

const TripTypeSelector: React.FC<TripTypeSelectorProps> = ({ value, onChange }) => {
  const options: { type: TripType; label: string; icon: React.ReactNode }[] = [
    {
      type: 'round-trip',
      label: 'Round-trip',
      icon: <ArrowRight size={16} className="rotate-180" />,
    },
    {
      type: 'one-way',
      label: 'One-way',
      icon: <ArrowRight size={16} />,
    },
    {
      type: 'multi-city',
      label: 'Multi-city',
      icon: <MapPin size={16} />,
    },
  ];

  return (
    <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
      {options.map((option) => (
        <button
          key={option.type}
          type="button"
          onClick={() => onChange(option.type)}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
            value === option.type
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-gray-600 hover:text-orange-600'
          }`}
        >
          {option.icon}
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default TripTypeSelector;

