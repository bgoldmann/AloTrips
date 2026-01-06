import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import FAQ, { FAQItem } from '@/components/FAQ';
import CrossVerticalLinks from '@/components/CrossVerticalLinks';

interface PackagesDestinationPageProps {
  params: Promise<{
    destination: string;
  }>;
}

export async function generateMetadata({ params }: PackagesDestinationPageProps): Promise<Metadata> {
  const { destination: destinationParam } = await params;
  const destinationName = decodeURIComponent(destinationParam).replace(/-/g, ' ');
  const capitalizedDestination = destinationName.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  return {
    title: `Vacation Packages to ${capitalizedDestination} | AloTrips.me - Compare. Book. Travel Cheaper.`,
    description: `Find the best vacation packages to ${capitalizedDestination}. Bundle flights, hotels, and car rentals to save up to 15% on your trip.`,
    keywords: `vacation packages ${capitalizedDestination}, ${capitalizedDestination} packages, ${capitalizedDestination} deals, flight hotel package ${capitalizedDestination}`,
  };
}

const destinationFAQs: FAQItem[] = [
  {
    question: 'How much can I save by booking a package?',
    answer: 'Our packages typically save you 10-15% compared to booking flights, hotels, and cars separately. The more components you bundle, the more you save.',
  },
  {
    question: 'What types of packages are available?',
    answer: 'We offer Flight + Hotel, Hotel + Car, and Flight + Hotel + Car packages. All packages are automatically created from the best available offers.',
  },
  {
    question: 'Can I customize my package?',
    answer: 'Packages are automatically generated from top offers, but you can search for specific dates and travelers to find packages that match your needs.',
  },
];

export default async function PackagesDestinationPage({ params }: PackagesDestinationPageProps) {
  const { destination: destinationParam } = await params;
  const destinationName = decodeURIComponent(destinationParam).replace(/-/g, ' ');
  const capitalizedDestination = destinationName.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Breadcrumbs items={[
          { label: 'Vacation Packages', href: '/packages' },
          { label: capitalizedDestination },
        ]} />
        
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
          Vacation Packages to {capitalizedDestination}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Bundle flights, hotels, and car rentals to save on your trip to {capitalizedDestination}
        </p>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Bundle & Save on Your Trip</h2>
          <p className="text-gray-700 mb-4">
            Search for vacation packages to {capitalizedDestination} using our search form above. We automatically bundle the best flights, hotels, and car rentals to save you money.
          </p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-orange-600 font-bold">•</span>
              <span>Save up to 15% by bundling multiple components</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-orange-600 font-bold">•</span>
              <span>Flight + Hotel, Hotel + Car, or Flight + Hotel + Car packages</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-orange-600 font-bold">•</span>
              <span>All packages show total savings compared to booking separately</span>
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

