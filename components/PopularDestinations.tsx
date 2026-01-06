'use client';

import React from 'react';
import Link from 'next/link';
import { Plane, Bed, Car, Package, Anchor, Ticket, MapPin } from 'lucide-react';

interface PopularDestination {
  name: string;
  country: string;
  image?: string;
  verticals: Array<{
    id: 'stays' | 'flights' | 'cars' | 'packages' | 'cruises' | 'things-to-do';
    label: string;
    icon: React.ReactNode;
    path: string;
  }>;
}

const popularDestinations: PopularDestination[] = [
  {
    name: 'Paris',
    country: 'France',
    verticals: [
      { id: 'stays', label: 'Hotels', icon: <Bed size={16} />, path: '/stays/paris' },
      { id: 'flights', label: 'Flights', icon: <Plane size={16} />, path: '/flights-to/paris' },
      { id: 'things-to-do', label: 'Activities', icon: <Ticket size={16} />, path: '/things-to-do/paris' },
      { id: 'packages', label: 'Packages', icon: <Package size={16} />, path: '/packages/paris' },
    ],
  },
  {
    name: 'New York',
    country: 'USA',
    verticals: [
      { id: 'stays', label: 'Hotels', icon: <Bed size={16} />, path: '/stays/new-york' },
      { id: 'flights', label: 'Flights', icon: <Plane size={16} />, path: '/flights-to/new-york' },
      { id: 'cars', label: 'Cars', icon: <Car size={16} />, path: '/cars/new-york' },
      { id: 'things-to-do', label: 'Activities', icon: <Ticket size={16} />, path: '/things-to-do/new-york' },
    ],
  },
  {
    name: 'Tokyo',
    country: 'Japan',
    verticals: [
      { id: 'stays', label: 'Hotels', icon: <Bed size={16} />, path: '/stays/tokyo' },
      { id: 'flights', label: 'Flights', icon: <Plane size={16} />, path: '/flights-to/tokyo' },
      { id: 'things-to-do', label: 'Activities', icon: <Ticket size={16} />, path: '/things-to-do/tokyo' },
      { id: 'packages', label: 'Packages', icon: <Package size={16} />, path: '/packages/tokyo' },
    ],
  },
  {
    name: 'London',
    country: 'UK',
    verticals: [
      { id: 'stays', label: 'Hotels', icon: <Bed size={16} />, path: '/stays/london' },
      { id: 'flights', label: 'Flights', icon: <Plane size={16} />, path: '/flights-to/london' },
      { id: 'cars', label: 'Cars', icon: <Car size={16} />, path: '/cars/london' },
      { id: 'things-to-do', label: 'Activities', icon: <Ticket size={16} />, path: '/things-to-do/london' },
    ],
  },
  {
    name: 'Barcelona',
    country: 'Spain',
    verticals: [
      { id: 'stays', label: 'Hotels', icon: <Bed size={16} />, path: '/stays/barcelona' },
      { id: 'flights', label: 'Flights', icon: <Plane size={16} />, path: '/flights-to/barcelona' },
      { id: 'things-to-do', label: 'Activities', icon: <Ticket size={16} />, path: '/things-to-do/barcelona' },
      { id: 'packages', label: 'Packages', icon: <Package size={16} />, path: '/packages/barcelona' },
    ],
  },
  {
    name: 'Dubai',
    country: 'UAE',
    verticals: [
      { id: 'stays', label: 'Hotels', icon: <Bed size={16} />, path: '/stays/dubai' },
      { id: 'flights', label: 'Flights', icon: <Plane size={16} />, path: '/flights-to/dubai' },
      { id: 'cars', label: 'Cars', icon: <Car size={16} />, path: '/cars/dubai' },
      { id: 'packages', label: 'Packages', icon: <Package size={16} />, path: '/packages/dubai' },
    ],
  },
  {
    name: 'Bali',
    country: 'Indonesia',
    verticals: [
      { id: 'stays', label: 'Hotels', icon: <Bed size={16} />, path: '/stays/bali' },
      { id: 'flights', label: 'Flights', icon: <Plane size={16} />, path: '/flights-to/bali' },
      { id: 'things-to-do', label: 'Activities', icon: <Ticket size={16} />, path: '/things-to-do/bali' },
      { id: 'packages', label: 'Packages', icon: <Package size={16} />, path: '/packages/bali' },
    ],
  },
  {
    name: 'Rome',
    country: 'Italy',
    verticals: [
      { id: 'stays', label: 'Hotels', icon: <Bed size={16} />, path: '/stays/rome' },
      { id: 'flights', label: 'Flights', icon: <Plane size={16} />, path: '/flights-to/rome' },
      { id: 'things-to-do', label: 'Activities', icon: <Ticket size={16} />, path: '/things-to-do/rome' },
      { id: 'packages', label: 'Packages', icon: <Package size={16} />, path: '/packages/rome' },
    ],
  },
];

interface PopularDestinationsProps {
  title?: string;
  maxDestinations?: number;
  className?: string;
}

const PopularDestinations: React.FC<PopularDestinationsProps> = ({ 
  title = 'Popular Destinations',
  maxDestinations = 8,
  className = ''
}) => {
  const destinations = popularDestinations.slice(0, maxDestinations);

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 ${className}`}>
      <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-6 flex items-center gap-2">
        <MapPin className="text-orange-600" size={28} />
        {title}
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {destinations.map((destination) => (
          <div
            key={destination.name}
            className="bg-gradient-to-br from-orange-50 to-white rounded-xl border border-orange-100 p-4 hover:shadow-md transition-shadow"
          >
            <div className="mb-3">
              <h3 className="text-lg font-bold text-gray-900">{destination.name}</h3>
              <p className="text-sm text-gray-600">{destination.country}</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {destination.verticals.map((vertical) => (
                <Link
                  key={vertical.id}
                  href={vertical.path}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-orange-50 border border-gray-200 hover:border-orange-300 rounded-lg text-xs font-semibold text-gray-700 hover:text-orange-600 transition-all"
                >
                  {vertical.icon}
                  {vertical.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularDestinations;

