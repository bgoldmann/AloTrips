import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cookie Policy | AloTrips.me',
  description: 'Cookie Policy for AloTrips.me - How we use cookies and tracking technologies',
};

export default function CookiesPage() {
  const lastUpdated = 'January 5, 2025';

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <h1 className="text-4xl font-black text-gray-900 mb-4">Cookie Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: {lastUpdated}</p>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. What Are Cookies?</h2>
              <p className="text-gray-700 leading-relaxed">
                Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. How We Use Cookies</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                AloTrips.me uses cookies and similar tracking technologies to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Remember your preferences and settings</li>
                <li>Track your search history and preferences</li>
                <li>Analyze website traffic and usage patterns</li>
                <li>Track affiliate clicks and conversions</li>
                <li>Provide personalized content and offers</li>
                <li>Improve website functionality and user experience</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Types of Cookies We Use</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.1 Essential Cookies</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                These cookies are necessary for the website to function properly. They enable core functionality such as:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Session management</li>
                <li>User authentication</li>
                <li>Security features</li>
                <li>Cookie consent preferences</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                <strong>These cookies cannot be disabled.</strong>
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.2 Analytics Cookies</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use analytics cookies to understand how visitors interact with our website. These cookies help us:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Count visitors and track page views</li>
                <li>Understand user behavior and preferences</li>
                <li>Identify popular content and features</li>
                <li>Improve website performance</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                We use services like Google Analytics for this purpose. You can opt out of Google Analytics by installing the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-orange-600 underline">Google Analytics Opt-out Browser Add-on</a>.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.3 Affiliate Tracking Cookies</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use cookies to track affiliate clicks and conversions. These cookies:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Generate unique click IDs for tracking</li>
                <li>Store session information</li>
                <li>Track user journey from click to conversion</li>
                <li>Enable commission tracking with our partners</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                These cookies are essential for our affiliate partnerships and help us maintain our free service.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.4 Preference Cookies</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                These cookies remember your preferences and settings, such as:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Currency preference</li>
                <li>Language settings</li>
                <li>Search history</li>
                <li>Display preferences</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Third-Party Cookies</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                In addition to our own cookies, we may also use various third-party cookies to report usage statistics and deliver advertisements. These include:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Google Analytics:</strong> Website analytics and usage tracking</li>
                <li><strong>Travel Providers:</strong> Cookies set when you visit provider websites</li>
                <li><strong>Advertising Networks:</strong> For personalized advertising (if applicable)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Cookie Duration</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5.1 Session Cookies</h3>
              <p className="text-gray-700 leading-relaxed">
                These cookies are temporary and are deleted when you close your browser. They are used to maintain your session while browsing our website.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5.2 Persistent Cookies</h3>
              <p className="text-gray-700 leading-relaxed">
                These cookies remain on your device for a set period (typically 30 days to 2 years) or until you delete them. They remember your preferences and settings for future visits.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Managing Cookies</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You have the right to accept or reject cookies. Most web browsers automatically accept cookies, but you can usually modify your browser settings to decline cookies if you prefer. However, this may prevent you from taking full advantage of our website.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">6.1 Browser Settings</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You can control cookies through your browser settings. Here are links to instructions for popular browsers:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-orange-600 underline">Google Chrome</a></li>
                <li><a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-orange-600 underline">Mozilla Firefox</a></li>
                <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-orange-600 underline">Safari</a></li>
                <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-orange-600 underline">Microsoft Edge</a></li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">6.2 Cookie Consent Banner</h3>
              <p className="text-gray-700 leading-relaxed">
                When you first visit our website, you'll see a cookie consent banner. You can accept or reject non-essential cookies through this banner. You can also change your preferences at any time by clicking the cookie settings link in our footer.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Impact of Disabling Cookies</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you choose to disable cookies, some features of our website may not function properly:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>You may need to re-enter your preferences on each visit</li>
                <li>Personalized content and offers may not be available</li>
                <li>Some website features may be limited</li>
                <li>Affiliate tracking may not work correctly</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Updates to This Cookie Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Cookie Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Contact Us</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about our use of cookies, please contact us at:
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

