'use client';

import React, { useState } from 'react';
import { Bell, X, DollarSign, Calendar, MapPin } from 'lucide-react';
import { Vertical } from '@/types';

interface PriceAlertFormProps {
  vertical: Vertical;
  destination: string;
  origin?: string;
  startDate?: string;
  endDate?: string;
  currentPrice?: number;
  onClose: () => void;
  onSuccess?: () => void;
}

const PriceAlertForm: React.FC<PriceAlertFormProps> = ({
  vertical,
  destination,
  origin,
  startDate,
  endDate,
  currentPrice,
  onClose,
  onSuccess,
}) => {
  const [targetPrice, setTargetPrice] = useState<string>(currentPrice ? (currentPrice * 0.9).toFixed(0) : '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/price-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vertical,
          origin,
          destination,
          startDate,
          endDate,
          targetPrice: targetPrice ? parseFloat(targetPrice) : null,
          searchParams: {
            origin,
            destination,
            startDate,
            endDate,
          },
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create price alert');
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create price alert');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Bell size={24} className="text-orange-500" />
            <h3 className="text-xl font-bold text-gray-900">Set Price Alert</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <MapPin size={16} />
            <span className="font-medium">{origin ? `${origin} → ` : ''}{destination}</span>
          </div>
          {startDate && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar size={16} />
              <span>{new Date(startDate).toLocaleDateString()}</span>
              {endDate && <span> - {new Date(endDate).toLocaleDateString()}</span>}
            </div>
          )}
          {currentPrice && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm">
                <DollarSign size={16} className="text-gray-400" />
                <span className="text-gray-600">Current price: </span>
                <span className="font-bold text-gray-900">${currentPrice.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="targetPrice" className="block text-sm font-semibold text-gray-700 mb-2">
              Alert me when price drops below:
            </label>
            <div className="relative">
              <DollarSign size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="targetPrice"
                type="number"
                step="0.01"
                min="0"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                placeholder={currentPrice ? `e.g., ${(currentPrice * 0.9).toFixed(0)}` : 'Enter target price'}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>
            {currentPrice && targetPrice && parseFloat(targetPrice) < currentPrice && (
              <p className="mt-2 text-sm text-emerald-600">
                You'll save ${(currentPrice - parseFloat(targetPrice)).toFixed(2)} per booking
              </p>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Alert'}
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            We'll email you when the price drops below your target. You can manage alerts in your account.
          </p>
        </form>
      </div>
    </div>
  );
};

export default PriceAlertForm;

