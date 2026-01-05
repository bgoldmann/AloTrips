import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | AloTrips.me',
  description: 'Terms of Service for AloTrips.me - Compare and book travel deals',
};

export default function TermsPage() {
  const lastUpdated = 'January 5, 2025';

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <h1 className="text-4xl font-black text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Last updated: {lastUpdated}</p>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using AloTrips.me ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Use License</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Permission is granted to temporarily access the materials on AloTrips.me for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to reverse engineer any software contained on AloTrips.me</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Affiliate Disclosure</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                AloTrips.me is a participant in various affiliate programs, which means we may earn commissions from qualifying purchases made through links on our site. We partner with travel providers including but not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Expedia</li>
                <li>Travelpayouts</li>
                <li>Skyscanner</li>
                <li>Kiwi</li>
                <li>Booking.com</li>
                <li>Agoda</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                When you click on a travel offer and make a purchase, we may receive a commission at no additional cost to you. This helps us maintain and improve our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Price Accuracy Disclaimer</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                While we strive to provide accurate pricing information, prices are subject to change without notice. The prices displayed on AloTrips.me are:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Estimated and may not reflect the final price at the time of booking</li>
                <li>Subject to availability and may vary by provider</li>
                <li>Inclusive of estimated taxes and fees, but final amounts may differ</li>
                <li>Displayed in the currency selected, but actual charges may be in a different currency</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                <strong>Always verify the final price directly with the travel provider before completing your booking.</strong> AloTrips.me is not responsible for any price discrepancies between our displayed prices and the actual booking prices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Third-Party Services</h2>
              <p className="text-gray-700 leading-relaxed">
                AloTrips.me aggregates travel offers from third-party providers. We do not own, operate, or control these travel services. When you click "View Deal" or similar buttons, you will be redirected to the provider's website. Your booking relationship is directly with the provider, not with AloTrips.me.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed">
                In no event shall AloTrips.me or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on AloTrips.me, even if AloTrips.me or an authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Accuracy of Materials</h2>
              <p className="text-gray-700 leading-relaxed">
                The materials appearing on AloTrips.me could include technical, typographical, or photographic errors. AloTrips.me does not warrant that any of the materials on its website are accurate, complete, or current. AloTrips.me may make changes to the materials contained on its website at any time without notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Links</h2>
              <p className="text-gray-700 leading-relaxed">
                AloTrips.me has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by AloTrips.me of the site. Use of any such linked website is at the user's own risk.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Modifications</h2>
              <p className="text-gray-700 leading-relaxed">
                AloTrips.me may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Governing Law</h2>
              <p className="text-gray-700 leading-relaxed">
                These terms and conditions are governed by and construed in accordance with applicable laws. Any disputes relating to these terms and conditions will be subject to the exclusive jurisdiction of the courts of the applicable jurisdiction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">11. Contact Information</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <p className="text-gray-700 leading-relaxed mt-2">
                Email: legal@alotrips.me<br />
                Website: <Link href="/" className="text-orange-500 hover:text-orange-600 underline">AloTrips.me</Link>
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link 
              href="/"
              className="inline-flex items-center text-orange-500 hover:text-orange-600 font-semibold"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

