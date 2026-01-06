import { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import FAQ, { FAQItem } from '@/components/FAQ';

interface FlightsRoutePageProps {
  params: Promise<{
    route: string;
  }>;
}

export async function generateMetadata({ params }: FlightsRoutePageProps): Promise<Metadata> {
  const { route: routeParam } = await params;
  const route = decodeURIComponent(routeParam);
  const [origin, destination] = route.includes('-to-') 
    ? route.split('-to-').map(city => city.replace(/-/g, ' ').split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' '))
    : ['', route.replace(/-/g, ' ').split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')];

  const title = origin 
    ? `Flights from ${origin} to ${destination} | AloTrips.me`
    : `Flights to ${destination} | AloTrips.me`;

  return {
    title: `${title} - Compare. Book. Travel Cheaper.`,
    description: `Compare flight prices from ${origin || 'multiple cities'} to ${destination}. Find the cheapest flights with our multi-provider search.`,
    keywords: `flights ${origin} to ${destination}, cheap flights ${destination}, ${origin} ${destination} flights`,
  };
}

const routeFAQs: FAQItem[] = [
  {
    question: 'How do I find the cheapest flights on this route?',
    answer: 'We search multiple flight providers simultaneously and show you the cheapest valid offers first. Use our filters to find non-stop flights, specific airlines, or preferred departure times.',
  },
  {
    question: 'Are the prices shown final?',
    answer: 'Prices include estimated taxes and fees. Final prices may vary slightly at checkout. We apply penalties to offers that hide fees to give you a more accurate total cost.',
  },
];

export default async function FlightsRoutePage({ params }: FlightsRoutePageProps) {
  const { route: routeParam } = await params;
  const route = decodeURIComponent(routeParam);
  const [origin, destination] = route.includes('-to-') 
    ? route.split('-to-').map(city => city.replace(/-/g, ' ').split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' '))
    : ['', route.replace(/-/g, ' ').split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')];

  const breadcrumbItems = [
    { label: 'Flights', href: '/flights' },
  ];

  if (origin) {
    breadcrumbItems.push({ label: `${origin} to ${destination}`, href: `/flights/${routeParam}` });
  } else {
    breadcrumbItems.push({ label: `Flights to ${destination}`, href: `/flights/${routeParam}` });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Breadcrumbs items={breadcrumbItems} />
        
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
          {origin ? `Flights from ${origin} to ${destination}` : `Flights to ${destination}`}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Compare flight prices from multiple airlines and booking sites
        </p>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Find the Best Flight Deals</h2>
          <p className="text-gray-700 mb-4">
            Use our search form above to find flights {origin ? `from ${origin} to ${destination}` : `to ${destination}`}. 
            We compare prices from Skyscanner, Kiwi, Travelpayouts, Expedia, and more.
          </p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-orange-600 font-bold">•</span>
              <span>Filter by stops, airlines, and departure times</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-orange-600 font-bold">•</span>
              <span>See total prices with all fees included</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-orange-600 font-bold">•</span>
              <span>Compare round-trip, one-way, and multi-city options</span>
            </li>
          </ul>
        </div>

        <FAQ items={routeFAQs} />
      </div>
    </div>
  );
}

