'use client';

import React from 'react';
import Link from 'next/link';
import { Plane, Bed, Car, Package, Anchor, Ticket, ArrowRight } from 'lucide-react';

interface CrossVerticalLinksProps {
  destination: string;
  className?: string;
}

const CrossVerticalLinks: React.FC<CrossVerticalLinksProps> = ({ destination, className = '' }) => {
  const verticals = [
    { id: 'stays', label: 'Hotels', icon: <Bed size={18} />, path: `/stays/${destination}` },
    { id: 'flights', label: 'Flights', icon: <Plane size={18} />, path: `/flights-to/${destination}` },
    { id: 'cars', label: 'Car Rentals', icon: <Car size={18} />, path: `/cars/${destination}` },
    { id: 'packages', label: 'Packages', icon: <Package size={18} />, path: `/packages/${destination}` },
    { id: 'things-to-do', label: 'Activities', icon: <Ticket size={18} />, path: `/things-to-do/${destination}` },
    { id: 'cruises', label: 'Cruises', icon: <Anchor size={18} />, path: `/cruises?destination=${destination}` },
  ];

  return (
    <div className={`bg-gradient-to-br from-orange-50 to-white rounded-2xl border border-orange-100 p-6 ${className}`}>
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span className="text-orange-600">Explore</span> {destination}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {verticals.map((vertical) => (
          <Link
            key={vertical.id}
            href={vertical.path}
            className="flex items-center gap-2 px-4 py-3 bg-white hover:bg-orange-50 border border-gray-200 hover:border-orange-300 rounded-xl transition-all group"
          >
            <div className="text-orange-600 group-hover:scale-110 transition-transform">
              {vertical.icon}
            </div>
            <span className="font-semibold text-gray-700 group-hover:text-orange-600 transition-colors">
              {vertical.label}
            </span>
            <ArrowRight size={14} className="ml-auto text-gray-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CrossVerticalLinks;

