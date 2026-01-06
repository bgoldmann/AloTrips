'use client';

import React, { useState } from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  EmailIcon,
} from 'react-share';
import { Share2, X } from 'lucide-react';
import { Offer, Vertical } from '@/types';

interface SocialShareProps {
  offer: Offer;
  vertical: Vertical;
  className?: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ offer, vertical, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Generate shareable URL with UTM tracking
  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/offers/${offer.id}`
    : 'https://alotrips.me';

  // Create share title
  const shareTitle = `${offer.title} - ${offer.subtitle || ''} | AloTrips.me`;
  
  // Create share description
  const shareDescription = `Check out this ${vertical} deal: ${offer.title} for ${offer.currency}${Math.round(offer.total_price)}`;

  // Extract route/destination for UTM term
  const routeMatch = offer.title.match(/(.+?)\s*→\s*(.+)/);
  const utmTerm = routeMatch 
    ? `${routeMatch[1]}-${routeMatch[2]}`.replace(/\s+/g, '-').toLowerCase()
    : (offer as any).destination || '';

  // Add UTM parameters to share URL
  const urlWithUTM = `${shareUrl}?utm_source=social_share&utm_medium=social&utm_campaign=${vertical}&utm_content=offer_card&utm_term=${utmTerm}`;

  const handleShare = () => {
    setIsOpen(!isOpen);
  };

  const iconSize = 32;
  const iconStyle = { borderRadius: '8px' };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleShare}
        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-colors"
        aria-label="Share this deal"
        aria-expanded={isOpen}
      >
        <Share2 size={18} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Share Menu */}
          <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 p-3 z-50 min-w-[200px]">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-gray-900">Share this deal</h4>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                aria-label="Close share menu"
              >
                <X size={16} className="text-gray-500" />
              </button>
            </div>
            
            <div className="flex gap-3 justify-center">
              <FacebookShareButton
                url={urlWithUTM}
                quote={shareDescription}
                hashtag="#AloTrips"
                className="transition-transform hover:scale-110"
              >
                <FacebookIcon size={iconSize} round style={iconStyle} />
              </FacebookShareButton>

              <TwitterShareButton
                url={urlWithUTM}
                title={shareTitle}
                hashtags={['AloTrips', 'Travel', 'Deals']}
                className="transition-transform hover:scale-110"
              >
                <TwitterIcon size={iconSize} round style={iconStyle} />
              </TwitterShareButton>

              <WhatsappShareButton
                url={urlWithUTM}
                title={shareTitle}
                separator=" - "
                className="transition-transform hover:scale-110"
              >
                <WhatsappIcon size={iconSize} round style={iconStyle} />
              </WhatsappShareButton>

              <EmailShareButton
                url={urlWithUTM}
                subject={shareTitle}
                body={shareDescription}
                className="transition-transform hover:scale-110"
              >
                <EmailIcon size={iconSize} round style={iconStyle} />
              </EmailShareButton>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(urlWithUTM);
                  setIsOpen(false);
                  // Could show a toast notification here
                }}
                className="w-full text-xs text-gray-600 hover:text-gray-900 font-medium py-2 px-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Copy Link
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SocialShare;

