import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import FAQ, { FAQItem } from '@/components/FAQ';
import CrossVerticalLinks from '@/components/CrossVerticalLinks';

interface CarsCityPageProps {
  params: Promise<{
    city: string;
  }>;
}

export async function generateMetadata({ params }: CarsCityPageProps): Promise<Metadata> {
  const { city: cityParam } = await params;
  const cityName = decodeURIComponent(cityParam).replace(/-/g, ' ');
  const capitalizedCity = cityName.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  return {
    title: `Car Rentals in ${capitalizedCity} | AloTrips.me - Compare. Book. Travel Cheaper.`,
    description: `Compare car rental prices in ${capitalizedCity} from top providers. Find the best deals on economy, luxury, and SUV rentals.`,
    keywords: `car rental ${capitalizedCity}, ${capitalizedCity} car hire, ${capitalizedCity} rental cars, cheap car rental ${capitalizedCity}`,
  };
}

const cityFAQs: FAQItem[] = [
  {
    question: 'How do I find the cheapest car rental in this city?',
    answer: 'We compare prices from multiple rental companies including Hertz, Avis, Budget, and more. Use our filters to find cars by class, transmission, and features.',
  },
  {
    question: 'What is included in the rental price?',
    answer: 'Base prices include the rental car and basic insurance. Additional fees like taxes, airport surcharges, and optional coverage are shown separately in the total price.',
  },
  {
    question: 'Can I cancel my reservation?',
    answer: 'Most car rentals offer free cancellation up to 24-48 hours before pickup. Look for the "Free Cancellation" badge when booking.',
  },
];

export default async function CarsCityPage({ params }: CarsCityPageProps) {
  const { city: cityParam } = await params;
  const cityName = decodeURIComponent(cityParam).replace(/-/g, ' ');
  const capitalizedCity = cityName.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Breadcrumbs items={[
          { label: 'Car Rentals', href: '/cars' },
          { label: capitalizedCity },
        ]} />
        
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
          Car Rentals in {capitalizedCity}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Compare car rental prices in {capitalizedCity} from top providers
        </p>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Find Your Perfect Rental Car</h2>
          <p className="text-gray-700 mb-4">
            Search for car rentals in {capitalizedCity} using our search form above. Compare prices from Hertz, Avis, Budget, Enterprise, and more to find the best deals.
          </p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-orange-600 font-bold">•</span>
              <span>Filter by car class, transmission, and supplier</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-orange-600 font-bold">•</span>
              <span>Compare unlimited mileage options</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-orange-600 font-bold">•</span>
              <span>See total prices with all fees included</span>
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

