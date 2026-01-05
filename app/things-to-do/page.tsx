import { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import FAQ, { FAQItem } from '@/components/FAQ';

export const metadata: Metadata = {
  title: 'Things to Do | AloTrips.me - Compare. Book. Travel Cheaper.',
  description: 'Discover and book activities, tours, and experiences at your destination. Compare prices from multiple providers.',
  keywords: 'activities, tours, things to do, experiences, attractions, tour booking',
};

const activitiesFAQs: FAQItem[] = [
  {
    question: 'What types of activities can I book?',
    answer: 'You can book tours, attractions, experiences, tickets to shows and events, and more. We compare prices from multiple activity providers.',
  },
  {
    question: 'Can I cancel my activity booking?',
    answer: 'Cancellation policies vary by activity and provider. Many activities offer free cancellation up to 24 hours before. Check individual activity details for cancellation policies.',
  },
];

export default function ThingsToDoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Breadcrumbs items={[{ label: 'Things to Do', href: '/things-to-do' }]} />
        
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
          Things to Do
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Discover and book activities, tours, and experiences
        </p>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Book Activities Through AloTrips?</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-orange-600 font-bold">✓</span>
              <span><strong>Compare multiple providers</strong> - Find the best prices for tours and activities</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-orange-600 font-bold">✓</span>
              <span><strong>Filter by date, duration, and category</strong> - Find exactly what you\'re looking for</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-orange-600 font-bold">✓</span>
              <span><strong>Instant booking</strong> - Book activities in advance to secure your spot</span>
            </li>
          </ul>
        </div>

        <FAQ items={activitiesFAQs} />
      </div>
    </div>
  );
}

