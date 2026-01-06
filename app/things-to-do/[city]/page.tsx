import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import FAQ, { FAQItem } from '@/components/FAQ';
import CrossVerticalLinks from '@/components/CrossVerticalLinks';

interface ThingsToDoCityPageProps {
  params: Promise<{
    city: string;
  }>;
}

export async function generateMetadata({ params }: ThingsToDoCityPageProps): Promise<Metadata> {
  const { city: cityParam } = await params;
  const cityName = decodeURIComponent(cityParam).replace(/-/g, ' ');
  const capitalizedCity = cityName.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  return {
    title: `Things to Do in ${capitalizedCity} | AloTrips.me - Compare. Book. Travel Cheaper.`,
    description: `Discover the best activities, tours, and attractions in ${capitalizedCity}. Compare prices and book tickets for top-rated experiences.`,
    keywords: `things to do ${capitalizedCity}, ${capitalizedCity} activities, ${capitalizedCity} tours, ${capitalizedCity} attractions, ${capitalizedCity} experiences`,
  };
}

const cityFAQs: FAQItem[] = [
  {
    question: 'How do I find the best activities in this city?',
    answer: 'Use our search filters to find activities by category, duration, rating, and price. We show the most popular and highly-rated experiences first.',
  },
  {
    question: 'Can I cancel or modify my booking?',
    answer: 'Many activities offer free cancellation up to 24 hours before the start time. Look for the "Free Cancellation" badge when browsing.',
  },
  {
    question: 'Are prices per person or per group?',
    answer: 'Prices are typically shown per person. Group discounts may be available for larger parties - check the activity details for more information.',
  },
];

export default async function ThingsToDoCityPage({ params }: ThingsToDoCityPageProps) {
  const { city: cityParam } = await params;
  const cityName = decodeURIComponent(cityParam).replace(/-/g, ' ');
  const capitalizedCity = cityName.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Breadcrumbs items={[
          { label: 'Things to Do', href: '/things-to-do' },
          { label: capitalizedCity },
        ]} />
        
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
          Things to Do in {capitalizedCity}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Discover the best activities, tours, and attractions in {capitalizedCity}
        </p>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Explore {capitalizedCity}</h2>
          <p className="text-gray-700 mb-4">
            Find the perfect activities in {capitalizedCity} using our search form above. Compare prices from multiple providers to find the best deals on tours, attractions, and experiences.
          </p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-orange-600 font-bold">•</span>
              <span>Filter by category, duration, and rating</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-orange-600 font-bold">•</span>
              <span>See verified reviews and ratings from real travelers</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-orange-600 font-bold">•</span>
              <span>Book with free cancellation on most activities</span>
            </li>
          </ul>
        </div>

        <FAQ items={cityFAQs} />

        <div className="mt-8">
          <CrossVerticalLinks destination={capitalizedCity} />
        </div>
      </div>
    </div>
  );
}

