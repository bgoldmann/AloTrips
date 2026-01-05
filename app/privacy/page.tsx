import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | AloTrips.me',
  description: 'Privacy Policy for AloTrips.me - How we collect, use, and protect your data',
};

export default function PrivacyPage() {
  const lastUpdated = 'January 5, 2025';

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <h1 className="text-4xl font-black text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: {lastUpdated}</p>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Introduction</h2>
              <p className="text-gray-700 leading-relaxed">
                AloTrips.me ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.1 Information You Provide</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We collect information that you voluntarily provide to us when you:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Search for travel offers (destination, dates, travelers, etc.)</li>
                <li>Create a user account</li>
                <li>Contact us for support</li>
                <li>Subscribe to our newsletter</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.2 Automatically Collected Information</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                When you visit our website, we automatically collect certain information, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>IP address and location data</li>
                <li>Browser type and version</li>
                <li>Device information</li>
                <li>Pages visited and time spent on pages</li>
                <li>Click patterns and interactions</li>
                <li>Referral sources</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.3 Cookies and Tracking Technologies</h3>
              <p className="text-gray-700 leading-relaxed">
                We use cookies, web beacons, and similar tracking technologies to track activity on our website and store certain information. For more details, please see our <Link href="/cookies" className="text-orange-500 hover:text-orange-600 underline">Cookie Policy</Link>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Provide, maintain, and improve our services</li>
                <li>Process and fulfill your travel search requests</li>
                <li>Personalize your experience and show relevant offers</li>
                <li>Track affiliate clicks and conversions</li>
                <li>Send you marketing communications (with your consent)</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Detect, prevent, and address technical issues</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Information Sharing and Disclosure</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.1 Third-Party Service Providers</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may share your information with third-party service providers who perform services on our behalf, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Travel providers (when you click "View Deal")</li>
                <li>Analytics providers (Google Analytics, etc.)</li>
                <li>Cloud hosting services (Supabase, Vercel)</li>
                <li>Email service providers</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.2 Affiliate Partners</h3>
              <p className="text-gray-700 leading-relaxed">
                When you click on a travel offer, we share tracking information (click IDs, session IDs, UTM parameters) with our affiliate partners to track conversions and process commissions.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.3 Legal Requirements</h3>
              <p className="text-gray-700 leading-relaxed">
                We may disclose your information if required to do so by law or in response to valid requests by public authorities.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Data Security</h2>
              <p className="text-gray-700 leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee its absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Your Rights</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Depending on your location, you may have the following rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Access:</strong> Request access to your personal data</li>
                <li><strong>Rectification:</strong> Request correction of inaccurate data</li>
                <li><strong>Erasure:</strong> Request deletion of your data</li>
                <li><strong>Restriction:</strong> Request restriction of processing</li>
                <li><strong>Portability:</strong> Request transfer of your data</li>
                <li><strong>Objection:</strong> Object to processing of your data</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent at any time</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                To exercise these rights, please contact us at privacy@alotrips.me.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Children's Privacy</h2>
              <p className="text-gray-700 leading-relaxed">
                Our service is not intended for children under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. International Data Transfers</h2>
              <p className="text-gray-700 leading-relaxed">
                Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that differ from those in your country. By using our service, you consent to the transfer of your information to these countries.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Changes to This Privacy Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Contact Us</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p className="text-gray-700 leading-relaxed mt-2">
                Email: privacy@alotrips.me<br />
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

