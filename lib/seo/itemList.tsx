import { Offer } from '@/types';

/**
 * Generate ItemList schema for listing pages
 * Based on PRD Section 5.2
 */
export function generateItemListSchema(offers: Offer[], pageUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: offers.map((offer, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': offer.vertical === 'stays' ? 'Hotel' : 
                offer.vertical === 'flights' ? 'Flight' :
                offer.vertical === 'cars' ? 'Car' : 'Product',
        name: offer.title,
        description: offer.subtitle,
        ...(offer.rating && {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: offer.rating,
            reviewCount: offer.reviewCount,
          },
        }),
        ...(offer.total_price && {
          offers: {
            '@type': 'Offer',
            price: offer.total_price,
            priceCurrency: offer.currency,
            availability: 'https://schema.org/InStock',
          },
        }),
      },
    })),
  };
}

