'use client';

import React from 'react';
import { AlertTriangle, X, RefreshCw } from 'lucide-react';

interface ProviderDownNoticeProps {
  provider: string;
  onDismiss?: () => void;
  onRetry?: () => void;
  retryable?: boolean;
}

/**
 * Component to display when a provider is down or unavailable
 */
const ProviderDownNotice: React.FC<ProviderDownNoticeProps> = ({
  provider,
  onDismiss,
  onRetry,
  retryable = true,
}) => {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg mb-4 animate-in slide-in-from-top-2">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-bold text-yellow-800">
            {provider} is currently unavailable
          </p>
          <p className="mt-1 text-sm text-yellow-700">
            We're showing results from other providers. Some offers may be missing.
          </p>
        </div>
        <div className="ml-4 flex items-center gap-2">
          {retryable && onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-yellow-800 bg-yellow-100 hover:bg-yellow-200 rounded-lg transition-colors"
            >
              <RefreshCw size={14} />
              Retry
            </button>
          )}
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-yellow-400 hover:text-yellow-500 transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderDownNotice;

