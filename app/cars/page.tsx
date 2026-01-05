import { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import FAQ, { FAQItem } from '@/components/FAQ';

export const metadata: Metadata = {
  title: 'Car Rentals | AloTrips.me - Compare. Book. Travel Cheaper.',
  description: 'Compare car rental prices from multiple providers. Find the best deals on rental cars worldwide.',
  keywords: 'car rental, rent a car, car hire, compare car rentals, cheap car rental',
};

const carsFAQs: FAQItem[] = [
  {
    question: 'Which car rental companies do you compare?',
    answer: 'We compare prices from major car rental providers including Hertz, Budget, Avis, Alamo, and more through our partner networks like Expedia and Booking.com.',
  },
  {
    question: 'What information do I need to rent a car?',
    answer: 'You\'ll typically need a valid driver\'s license, credit card, and proof of insurance. Age requirements vary by location and rental company.',
  },
  {
    question: 'Are there any hidden fees?',
    answer: 'We show total prices including estimated taxes and fees. Additional fees may apply for extras like GPS, child seats, or additional drivers. Always check the rental terms before booking.',
  },
];

export default function CarsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Breadcrumbs items={[{ label: 'Cars', href: '/cars' }]} />
        
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
          Car Rentals
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Compare car rental prices from multiple providers
        </p>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Book Car Rentals Through AloTrips?</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-orange-600 font-bold">✓</span>
              <span><strong>Compare multiple providers</strong> - Find the best price across all major rental companies</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-orange-600 font-bold">✓</span>
              <span><strong>Filter by car class and features</strong> - Find exactly the car you need</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-orange-600 font-bold">✓</span>
              <span><strong>Unlimited mileage options</strong> - Filter for rentals with unlimited mileage</span>
            </li>
          </ul>
        </div>

        <FAQ items={carsFAQs} />
      </div>
    </div>
  );
}

