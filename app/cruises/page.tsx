import { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import FAQ, { FAQItem } from '@/components/FAQ';

export const metadata: Metadata = {
  title: 'Cruises | AloTrips.me - Compare. Book. Travel Cheaper.',
  description: 'Compare cruise deals from multiple cruise lines. Find the best cruise prices and itineraries.',
  keywords: 'cruises, cruise deals, cruise booking, compare cruises',
};

const cruisesFAQs: FAQItem[] = [
  {
    question: 'Which cruise lines do you compare?',
    answer: 'We compare deals from major cruise lines including Royal Caribbean, Carnival, Norwegian, and more through our partner networks.',
  },
  {
    question: 'What is included in a cruise price?',
    answer: 'Cruise prices typically include accommodations, meals, and entertainment. Port fees, gratuities, and excursions are usually additional. Check individual cruise details for what\'s included.',
  },
];

export default function CruisesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Breadcrumbs items={[{ label: 'Cruises', href: '/cruises' }]} />
        
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
          Cruises
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Compare cruise deals from multiple cruise lines
        </p>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Book Cruises Through AloTrips?</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-orange-600 font-bold">✓</span>
              <span><strong>Compare multiple cruise lines</strong> - Find the best prices and itineraries</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-orange-600 font-bold">✓</span>
              <span><strong>Filter by region and cruise line</strong> - Find your perfect cruise</span>
            </li>
          </ul>
        </div>

        <FAQ items={cruisesFAQs} />
      </div>
    </div>
  );
}

