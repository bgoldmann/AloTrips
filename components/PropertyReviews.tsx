'use client';

import React, { useState, useEffect } from 'react';
import { Star, User, MapPin, CheckCircle } from 'lucide-react';
import Image from 'next/image';

interface Review {
  id: string;
  rating: number;
  title: string | null;
  review_text: string;
  reviewer_name: string | null;
  reviewer_location: string | null;
  verified_booking: boolean;
  helpful_count: number;
  review_date: string;
}

interface PropertyReviewsProps {
  propertyId: string;
  maxReviews?: number;
}

const PropertyReviews: React.FC<PropertyReviewsProps> = ({ propertyId, maxReviews = 10 }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, [propertyId]);

  const loadReviews = async () => {
    try {
      const response = await fetch(`/api/properties/reviews?propertyId=${propertyId}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
        setAverageRating(data.averageRating || 0);
        setTotalReviews(data.totalReviews || 0);
      }
    } catch (error) {
      console.error('Failed to load reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={star <= rating ? 'text-orange-500 fill-orange-500' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-20 bg-gray-200 rounded-xl"></div>
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Star size={48} className="mx-auto mb-3 text-gray-300" />
        <p className="text-sm">No reviews yet</p>
        <p className="text-xs mt-1">Be the first to review this property</p>
      </div>
    );
  }

  const displayedReviews = reviews.slice(0, maxReviews);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl border border-orange-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="text-4xl font-black text-orange-600">{averageRating.toFixed(1)}</div>
              <div>
                {renderStars(Math.round(averageRating))}
                <p className="text-sm text-gray-600 mt-1">{totalReviews} reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {displayedReviews.map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:border-orange-300 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {renderStars(review.rating)}
                  {review.verified_booking && (
                    <span className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                      <CheckCircle size={12} />
                      Verified
                    </span>
                  )}
                </div>
                {review.title && (
                  <h4 className="font-bold text-gray-900 mb-1">{review.title}</h4>
                )}
                <p className="text-sm text-gray-700 leading-relaxed">{review.review_text}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                {review.reviewer_name && (
                  <>
                    <User size={12} />
                    <span className="font-semibold">{review.reviewer_name}</span>
                  </>
                )}
                {review.reviewer_location && (
                  <>
                    <MapPin size={12} />
                    <span>{review.reviewer_location}</span>
                  </>
                )}
              </div>
              <div className="text-xs text-gray-400">
                {new Date(review.review_date).toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric',
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {reviews.length > maxReviews && (
        <button className="w-full py-3 px-4 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-xl text-orange-600 font-bold transition-colors">
          Show all {totalReviews} reviews
        </button>
      )}
    </div>
  );
};

export default PropertyReviews;

