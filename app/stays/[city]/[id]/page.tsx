import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Offer } from '@/types';

interface PropertyDetailPageProps {
  params: Promise<{
    city: string;
    id: string;
  }>;
}

// In production, this would fetch from database or API
async function getProperty(id: string): Promise<Offer | null> {
  // Mock data - replace with actual API call
  return null;
}

export async function generateMetadata({ params }: PropertyDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const property = await getProperty(id);
  
  if (!property) {
    return {
      title: 'Property Not Found | AloTrips.me',
    };
  }

  return {
    title: `${property.title} | AloTrips.me - Compare. Book. Travel Cheaper.`,
    description: property.subtitle || `Book ${property.title} at the best price. Compare deals from multiple booking sites.`,
  };
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { id, city: cityParam } = await params;
  const property = await getProperty(id);
  const cityName = decodeURIComponent(cityParam).replace(/-/g, ' ');
  const capitalizedCity = cityName.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  if (!property) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Breadcrumbs items={[
          { label: 'Stays', href: '/stays' },
          { label: capitalizedCity, href: `/stays/${cityParam}` },
          { label: property.title },
        ]} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-black text-gray-900 mb-4">
              {property.title}
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              {property.subtitle}
            </p>

            {/* Image Gallery Placeholder */}
            <div className="bg-gray-200 rounded-2xl h-96 mb-6 flex items-center justify-center">
              <p className="text-gray-500">Property Images</p>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About this property</h2>
              <p className="text-gray-700">
                {property.subtitle || 'A wonderful property in a great location.'}
              </p>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-orange-600">✓</span>
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-4">
              <div className="mb-6">
                <div className="text-3xl font-black text-gray-900 mb-2">
                  ${Math.round(property.total_price)}
                </div>
                <div className="text-sm text-gray-500">
                  Total price via {property.provider}
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-orange-200">
                View Deal
              </button>

              {property.rating && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl font-bold text-gray-900">{property.rating}</span>
                    <span className="text-gray-500">/ 5</span>
                  </div>
                  {property.reviewCount && (
                    <p className="text-sm text-gray-600">
                      {property.reviewCount} reviews
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

