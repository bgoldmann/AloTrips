import { MetadataRoute } from 'next';

// Popular destinations for sitemap generation
const POPULAR_CITIES = [
  'new-york', 'london', 'paris', 'tokyo', 'barcelona', 'rome', 'amsterdam',
  'dubai', 'singapore', 'bangkok', 'sydney', 'los-angeles', 'miami',
  'berlin', 'madrid', 'vienna', 'prague', 'istanbul', 'cairo', 'mumbai',
];

// Popular flight routes
const POPULAR_ROUTES = [
  'new-york-to-london',
  'london-to-paris',
  'new-york-to-paris',
  'los-angeles-to-tokyo',
  'sydney-to-bangkok',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://alotrips.me';

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    // Vertical hub pages
    {
      url: `${baseUrl}/stays`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/flights`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cars`,
      lastModified: new Date(),
        changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/packages`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/cruises`,
      lastModified: new Date(),
        changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/things-to-do`,
      lastModified: new Date(),
        changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    // Destination pages
    ...POPULAR_CITIES.map(city => ({
      url: `${baseUrl}/stays/${city}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
    // Flight route pages
    ...POPULAR_ROUTES.map(route => ({
      url: `${baseUrl}/flights/${route}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
  ];

  return routes;
}

