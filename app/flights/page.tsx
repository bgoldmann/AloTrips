import { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import FAQ, { FAQItem } from '@/components/FAQ';

export const metadata: Metadata = {
  title: 'Flights | AloTrips.me - Compare. Book. Travel Cheaper.',
  description: 'Compare flight prices from multiple airlines and booking sites. Find the cheapest flights with our multi-provider search engine.',
  keywords: 'flights, cheap flights, compare flights, airline tickets, flight deals',
};

const flightsFAQs: FAQItem[] = [
  {
    question: 'How do you find the cheapest flights?',
    answer: 'We search multiple flight providers including Skyscanner, Kiwi, Travelpayouts, and Expedia simultaneously. Our system compares prices, applies anti-fake-cheap penalties, and shows you the truly cheapest options first.',
  },
  {
    question: 'What does "Best Value" mean?',
    answer: 'When prices are very close (within $5 or 1%), our EPC-optimized engine selects the option that offers the best combination of price and quality. This helps us recommend options that are both affordable and reliable.',
  },
  {
    question: 'Are baggage fees included in the price?',
    answer: 'We show total prices including estimated taxes and fees. Baggage fees may vary by airline. We apply penalties to offers that don\'t include baggage to give you a more accurate total cost.',
  },
  {
    question: 'Can I book directly through AloTrips?',
    answer: 'We redirect you to our partner booking sites to complete your purchase. This allows you to book directly with the airline or travel agency while we track the referral.',
  },
];

export default function FlightsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Breadcrumbs items={[{ label: 'Flights', href: '/flights' }]} />
        
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
          Flights
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Compare flight prices from multiple airlines and booking sites
        </p>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Book Flights Through AloTrips?</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-orange-600 font-bold">✓</span>
              <span><strong>Multi-provider search</strong> - Compare Skyscanner, Kiwi, Travelpayouts, and more in one search</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-orange-600 font-bold">✓</span>
              <span><strong>Anti-fake-cheap protection</strong> - We penalize offers that hide fees, so you see real total prices</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-orange-600 font-bold">✓</span>
              <span><strong>Best Value recommendations</strong> - Our EPC engine finds the best balance of price and quality</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-orange-600 font-bold">✓</span>
              <span><strong>Filter by stops, airlines, and times</strong> - Find exactly what you need</span>
            </li>
          </ul>
        </div>

        <FAQ items={flightsFAQs} />
      </div>
    </div>
  );
}

