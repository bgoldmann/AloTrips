import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import FAQ, { FAQItem } from '@/components/FAQ';

interface StaysCityPageProps {
  params: {
    city: string;
  };
}

export async function generateMetadata({ params }: StaysCityPageProps): Promise<Metadata> {
  const cityName = decodeURIComponent(params.city).replace(/-/g, ' ');
  const capitalizedCity = cityName.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  return {
    title: `Hotels in ${capitalizedCity} | AloTrips.me - Compare. Book. Travel Cheaper.`,
    description: `Find the best hotel deals in ${capitalizedCity}. Compare prices from hundreds of booking sites.`,
    keywords: `hotels ${capitalizedCity}, ${capitalizedCity} hotels, ${capitalizedCity} accommodations, hotel deals ${capitalizedCity}`,
  };
}

const cityFAQs: FAQItem[] = [
  {
    question: 'How do I find the cheapest hotels in this city?',
    answer: 'Use our search filters to compare prices by date, star rating, and amenities. We show the cheapest valid offers first, with clear total prices including taxes and fees.',
  },
  {
    question: 'Which neighborhoods are best to stay in?',
    answer: 'Use our map view to see hotel locations and filter by neighborhood. Popular areas are usually highlighted in our search results.',
  },
];

export default function StaysCityPage({ params }: StaysCityPageProps) {
  const cityName = decodeURIComponent(params.city).replace(/-/g, ' ');
  const capitalizedCity = cityName.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Breadcrumbs items={[
          { label: 'Stays', href: '/stays' },
          { label: capitalizedCity },
        ]} />
        
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
          Hotels in {capitalizedCity}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Compare hotel prices in {capitalizedCity} from hundreds of booking sites
        </p>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Find Your Perfect Stay in {capitalizedCity}</h2>
          <p className="text-gray-700 mb-4">
            Search for hotels in {capitalizedCity} using our search form above. Compare prices from Expedia, Booking.com, Agoda, and more to find the best deals.
          </p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-orange-600 font-bold">•</span>
              <span>Filter by price, star rating, and amenities</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-orange-600 font-bold">•</span>
              <span>View hotels on a map to see locations</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-orange-600 font-bold">•</span>
              <span>See total prices including taxes and fees</span>
            </li>
          </ul>
        </div>

        <FAQ items={cityFAQs} />
      </div>
    </div>
  );
}

