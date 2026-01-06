'use client';

import React, { useState } from 'react';
import { Offer } from '@/types';
import { getCurrencySymbol } from '@/lib/currency';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface PriceBreakdownProps {
  offer: Offer;
  showBreakdown?: boolean; // Whether to show expanded breakdown by default
  className?: string;
}

const PriceBreakdown: React.FC<PriceBreakdownProps> = ({ 
  offer, 
  showBreakdown = false,
  className = '' 
}) => {
  const [isExpanded, setIsExpanded] = useState(showBreakdown);
  const currencySymbol = getCurrencySymbol(offer.currency as any);
  
  const basePrice = offer.base_price || 0;
  const taxesFees = offer.taxes_fees || 0;
  const totalPrice = offer.total_price || basePrice + taxesFees;
  const penaltyAmount = totalPrice - (basePrice + taxesFees);

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Total Price Display */}
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium text-gray-600">Total Price</span>
        <div className="text-right">
          <span className="text-2xl font-black text-gray-900 tracking-tight">
            {currencySymbol}{Math.round(totalPrice)}
          </span>
          <span className="text-xs text-gray-400 block mt-0.5">
            via {offer.provider}
          </span>
        </div>
      </div>

      {/* Expandable Breakdown */}
      {basePrice > 0 && (
        <div className="border-t border-gray-100 pt-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between text-sm text-gray-600 hover:text-gray-900 transition-colors py-1"
            aria-label={isExpanded ? 'Hide price breakdown' : 'Show price breakdown'}
            aria-expanded={isExpanded}
          >
            <span className="font-medium">Price breakdown</span>
            {isExpanded ? (
              <ChevronUp size={16} className="text-gray-400" />
            ) : (
              <ChevronDown size={16} className="text-gray-400" />
            )}
          </button>

          {isExpanded && (
            <div className="mt-2 space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Base price</span>
                <span className="font-medium">{currencySymbol}{basePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Taxes & fees</span>
                <span className="font-medium">{currencySymbol}{taxesFees.toFixed(2)}</span>
              </div>
              {penaltyAmount > 0.01 && (
                <div className="flex justify-between text-gray-500 text-xs border-t border-gray-100 pt-1.5">
                  <span>Trust adjustment*</span>
                  <span>+{currencySymbol}{penaltyAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-1.5 mt-1">
                <span>Total</span>
                <span>{currencySymbol}{Math.round(totalPrice)}</span>
              </div>
              {penaltyAmount > 0.01 && (
                <p className="text-xs text-gray-500 mt-2 italic">
                  *Adjustment applied for offers with missing information (baggage, cancellation, etc.)
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PriceBreakdown;

