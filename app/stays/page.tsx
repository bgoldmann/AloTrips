import { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import FAQ, { FAQItem } from '@/components/FAQ';

export const metadata: Metadata = {
  title: 'Hotels & Stays | AloTrips.me - Compare. Book. Travel Cheaper.',
  description: 'Compare hundreds of hotel booking sites. Find the best deals on hotels, resorts, and vacation rentals worldwide.',
  keywords: 'hotels, stays, accommodations, hotel booking, compare hotels, best hotel deals',
};

const staysFAQs: FAQItem[] = [
  {
    question: 'How do I find the cheapest hotel deals?',
    answer: 'AloTrips.me compares prices from hundreds of booking sites including Expedia, Booking.com, Agoda, and more. We show you the cheapest valid offer first, and highlight the best value options based on our EPC-optimized recommendation engine.',
  },
  {
    question: 'Are the prices shown final?',
    answer: 'Prices include estimated taxes and fees. Final prices may vary slightly at checkout. We always show the total price upfront to avoid surprises.',
  },
  {
    question: 'Can I cancel my hotel booking?',
    answer: 'Cancellation policies vary by hotel and booking site. We clearly mark properties with free cancellation. Always check the cancellation policy before booking.',
  },
  {
    question: 'Do you charge booking fees?',
    answer: 'No, AloTrips.me does not charge any booking fees. We may earn a commission from our partners when you book through our links, but this does not affect the price you pay.',
  },
];

export default function StaysPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Breadcrumbs items={[{ label: 'Stays', href: '/stays' }]} />
        
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
          Hotels & Stays
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Compare hundreds of booking sites to find the best hotel deals worldwide
        </p>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Book Through AloTrips?</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-orange-600 font-bold">✓</span>
              <span><strong>Compare hundreds of sites</strong> - We aggregate offers from Expedia, Booking.com, Agoda, and more</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-orange-600 font-bold">✓</span>
              <span><strong>Best Value Engine</strong> - Our EPC-optimized system finds you the best deals</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-orange-600 font-bold">✓</span>
              <span><strong>No hidden fees</strong> - We show total prices upfront, including taxes and fees</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-orange-600 font-bold">✓</span>
              <span><strong>Free cancellation options</strong> - Filter for properties with free cancellation</span>
            </li>
          </ul>
        </div>

        <FAQ items={staysFAQs} />
      </div>
    </div>
  );
}

