'use client';

import React from 'react';
import { Vertical, SortOption } from '@/types';
import { ArrowUpDown, ArrowUp, ArrowDown, Star, Clock, DollarSign } from 'lucide-react';

interface ResultsToolbarProps {
  vertical: Vertical;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  resultCount: number;
  onFilterToggle?: () => void;
  showFilters?: boolean;
}

const ResultsToolbar: React.FC<ResultsToolbarProps> = ({
  vertical,
  sortBy,
  onSortChange,
  resultCount,
  onFilterToggle,
  showFilters = false,
}) => {
  const sortOptions: { value: SortOption; label: string; icon: React.ReactNode }[] = [
    { value: 'recommended', label: 'Recommended', icon: <Star size={14} /> },
    { value: 'price-asc', label: 'Price: Low to High', icon: <DollarSign size={14} /> },
    { value: 'price-desc', label: 'Price: High to Low', icon: <DollarSign size={14} /> },
    { value: 'rating-desc', label: 'Highest Rated', icon: <Star size={14} /> },
  ];

  // Add duration sort for flights
  if (vertical === 'flights') {
    sortOptions.push(
      { value: 'duration-asc', label: 'Shortest Duration', icon: <Clock size={14} /> },
      { value: 'duration-desc', label: 'Longest Duration', icon: <Clock size={14} /> }
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      {/* Results Count */}
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold text-gray-800">
          <span className="text-orange-600">{resultCount}</span> {resultCount === 1 ? 'result' : 'results'}
        </h2>
        
        {onFilterToggle && (
          <button
            onClick={onFilterToggle}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
              showFilters
                ? 'bg-orange-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        )}
      </div>

      {/* Sort Dropdown */}
      <div className="relative group">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm hover:shadow-md transition-all cursor-pointer">
          <ArrowUpDown size={16} className="text-gray-500" />
          <span className="text-sm font-bold text-gray-700">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="appearance-none bg-transparent border-none outline-none text-sm font-bold text-orange-600 cursor-pointer pr-6"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ArrowDown size={14} className="text-gray-400 absolute right-3 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default ResultsToolbar;

