import { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import FAQ, { FAQItem } from '@/components/FAQ';

export const metadata: Metadata = {
  title: 'Vacation Packages | AloTrips.me - Compare. Book. Travel Cheaper.',
  description: 'Bundle and save with vacation packages. Compare flight + hotel packages for the best deals.',
  keywords: 'vacation packages, travel packages, flight and hotel deals, bundle deals',
};

const packagesFAQs: FAQItem[] = [
  {
    question: 'What is included in a vacation package?',
    answer: 'Packages typically include flights and hotel accommodations. Some packages may also include car rentals, activities, or meals. Each package clearly lists what\'s included.',
  },
  {
    question: 'Do packages save money?',
    answer: 'Yes! Bundling flights and hotels together often results in significant savings compared to booking separately. Our system finds the best package deals across multiple providers.',
  },
  {
    question: 'Can I customize a package?',
    answer: 'Package options vary by provider. Some allow customization of hotels or flight times, while others are fixed. Check individual package details for customization options.',
  },
];

export default function PackagesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Breadcrumbs items={[{ label: 'Packages', href: '/packages' }]} />
        
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
          Vacation Packages
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Bundle and save with flight + hotel packages
        </p>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Book Vacation Packages?</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-orange-600 font-bold">✓</span>
              <span><strong>Save money</strong> - Bundling flights and hotels often costs less than booking separately</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-orange-600 font-bold">✓</span>
              <span><strong>Convenience</strong> - Book everything in one transaction</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-orange-600 font-bold">✓</span>
              <span><strong>Best deals</strong> - We compare packages from multiple providers</span>
            </li>
          </ul>
        </div>

        <FAQ items={packagesFAQs} />
      </div>
    </div>
  );
}

