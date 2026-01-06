import { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import FAQ, { FAQItem } from '@/components/FAQ';
import CrossVerticalLinks from '@/components/CrossVerticalLinks';

interface FlightsToDestinationPageProps {
  params: Promise<{
    destination: string;
  }>;
}

export async function generateMetadata({ params }: FlightsToDestinationPageProps): Promise<Metadata> {
  const { destination: destinationParam } = await params;
  const destinationName = decodeURIComponent(destinationParam).replace(/-/g, ' ');
  const capitalizedDestination = destinationName.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  return {
    title: `Flights to ${capitalizedDestination} | AloTrips.me - Compare. Book. Travel Cheaper.`,
    description: `Compare flight prices to ${capitalizedDestination} from multiple airlines and booking sites. Find the cheapest flights with flexible dates.`,
    keywords: `flights to ${capitalizedDestination}, cheap flights ${capitalizedDestination}, ${capitalizedDestination} flights, ${capitalizedDestination} airfare`,
  };
}

const destinationFAQs: FAQItem[] = [
  {
    question: 'How do I find the cheapest flights to this destination?',
    answer: 'We search multiple flight providers simultaneously and show you the cheapest valid offers first. Use flexible dates to see prices across a range of dates.',
  },
  {
    question: 'Can I search for flights from multiple origins?',
    answer: 'Yes! Use our search form to enter your origin city or airport. You can also use flexible dates to find the best prices across different departure dates.',
  },
  {
    question: 'Are the prices shown final?',
    answer: 'Prices include estimated taxes and fees. Final prices may vary slightly at checkout. We apply penalties to offers that hide fees to give you a more accurate total cost.',
  },
];

export default async function FlightsToDestinationPage({ params }: FlightsToDestinationPageProps) {
  const { destination: destinationParam } = await params;
  const destinationName = decodeURIComponent(destinationParam).replace(/-/g, ' ');
  const capitalizedDestination = destinationName.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Breadcrumbs items={[
          { label: 'Flights', href: '/flights' },
          { label: `Flights to ${capitalizedDestination}` },
        ]} />
        
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
          Flights to {capitalizedDestination}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Compare flight prices to {capitalizedDestination} from multiple airlines and booking sites
        </p>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Find the Best Flight Deals</h2>
          <p className="text-gray-700 mb-4">
            Use our search form above to find flights to {capitalizedDestination}. 
            We compare prices from Skyscanner, Kiwi, Travelpayouts, Expedia, and more.
          </p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-orange-600 font-bold">•</span>
              <span>Filter by stops, airlines, and departure times</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-orange-600 font-bold">•</span>
              <span>Use flexible dates to find the cheapest prices</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-orange-600 font-bold">•</span>
              <span>Compare round-trip, one-way, and multi-city options</span>
            </li>
          </ul>
        </div>

        <FAQ items={destinationFAQs} />

        <div className="mt-8">
          <CrossVerticalLinks destination={capitalizedDestination} />
        </div>
      </div>
    </div>
  );
}

