import React, { useState, useEffect } from 'react';
import { Cookie, X, ShieldCheck } from 'lucide-react';

interface ConsentState {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consent, setConsent] = useState<ConsentState>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const savedConsent = localStorage.getItem('aloTrips_cookie_consent');
    if (!savedConsent) {
      // Small delay to prevent layout thrashing on load
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const allConsent = { necessary: true, analytics: true, marketing: true };
    saveConsent(allConsent);
  };

  const handleRejectAll = () => {
    const minConsent = { necessary: true, analytics: false, marketing: false };
    saveConsent(minConsent);
  };

  const handleSavePreferences = () => {
    saveConsent(consent);
  };

  const saveConsent = (preferences: ConsentState) => {
    localStorage.setItem('aloTrips_cookie_consent', JSON.stringify(preferences));
    setIsVisible(false);
    console.log('Consent saved:', preferences); 
  };

  const toggleCategory = (category: keyof ConsentState) => {
    if (category === 'necessary') return;
    setConsent(prev => ({ ...prev, [category]: !prev[category] }));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-white/95 backdrop-blur-xl border-t border-orange-100 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] animate-in slide-in-from-bottom-20 duration-700">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Banner Content */}
        {!showDetails ? (
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                  <Cookie size={22} />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Your Privacy Matters</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed max-w-3xl font-medium">
                We use cookies to enhance your experience, analyze site traffic, and deliver personalized content. 
                By clicking "Accept All", you consent to our use of cookies. 
                For US residents, this includes consent to share data for personalized advertising (Do Not Sell/Share My Info).
                View our <a href="#" className="text-orange-600 hover:text-orange-700 hover:underline font-bold">Privacy Policy</a>.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <button 
                onClick={() => setShowDetails(true)}
                className="px-5 py-3 text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Customize
              </button>
              <button 
                onClick={handleRejectAll}
                className="px-5 py-3 text-sm font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors"
              >
                Reject Non-Essential
              </button>
              <button 
                onClick={handleAcceptAll}
                className="px-6 py-3 text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-lg shadow-orange-200 transition-all hover:-translate-y-0.5"
              >
                Accept All
              </button>
            </div>
          </div>
        ) : (
          /* Detailed Preferences View */
          <div className="animate-in fade-in duration-300">
            <div className="flex justify-between items-start mb-6">
              <div>
                 <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                   <ShieldCheck size={24} className="text-emerald-500"/> Cookie Preferences
                 </h3>
                 <p className="text-sm text-gray-500 mt-1 font-medium">Manage your consent preferences for different cookie categories.</p>
              </div>
              <button onClick={() => setShowDetails(false)} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {/* Necessary */}
              <div className="p-5 border border-orange-200 bg-orange-50/50 rounded-2xl relative">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-orange-900 text-sm">Strictly Necessary</span>
                  <div className="w-11 h-6 bg-orange-300 rounded-full relative opacity-50 cursor-not-allowed">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                  </div>
                </div>
                <p className="text-xs text-orange-800/80 font-medium leading-relaxed">Required for the website to function (e.g., logging in, booking).</p>
              </div>

              {/* Analytics */}
              <div 
                className={`p-5 border rounded-2xl cursor-pointer transition-all ${consent.analytics ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-500' : 'border-gray-200 hover:border-orange-300 hover:shadow-md'}`}
                onClick={() => toggleCategory('analytics')}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className={`font-bold text-sm ${consent.analytics ? 'text-orange-900' : 'text-gray-700'}`}>Analytics & Performance</span>
                  <div className={`w-11 h-6 rounded-full relative transition-colors ${consent.analytics ? 'bg-orange-600' : 'bg-gray-300'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${consent.analytics ? 'left-6' : 'left-1'}`}></div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">Helps us understand how you use the site to improve our services.</p>
              </div>

              {/* Marketing */}
              <div 
                className={`p-5 border rounded-2xl cursor-pointer transition-all ${consent.marketing ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-500' : 'border-gray-200 hover:border-orange-300 hover:shadow-md'}`}
                onClick={() => toggleCategory('marketing')}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className={`font-bold text-sm ${consent.marketing ? 'text-orange-900' : 'text-gray-700'}`}>Marketing & Targeting</span>
                  <div className={`w-11 h-6 rounded-full relative transition-colors ${consent.marketing ? 'bg-orange-600' : 'bg-gray-300'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${consent.marketing ? 'left-6' : 'left-1'}`}></div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">Used to deliver relevant ads and track campaign performance.</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
               <button 
                onClick={() => setShowDetails(false)}
                className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSavePreferences}
                className="px-8 py-2.5 text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-lg shadow-orange-200 transition-all hover:-translate-y-0.5"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CookieBanner;