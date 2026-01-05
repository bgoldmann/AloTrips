'use client';

import React, { useState, useEffect } from 'react';
import { Vertical, SearchParams, Offer } from '../types';
import { searchOffers } from '../services/searchService';
import OfferCard from './OfferCard';
import UpsellBanner from './UpsellBanner';
import PriceTrendChart from './PriceTrendChart';
import GeminiAssistant from './GeminiAssistant';
import DateRangePicker from './DateRangePicker';
import DealShowcase from './DealShowcase';
import Footer from './Footer';
import CookieBanner from './CookieBanner';
import UserProfilePage from './UserProfile';
import AdminPanel from './AdminPanel';
import { 
  Plane, Bed, Car, Package, Anchor, Ticket, 
  Search, MapPin, User, Menu, Globe, DollarSign, Euro, Sunset, LogOut, Settings, LayoutDashboard
} from 'lucide-react';

type AppView = 'home' | 'profile' | 'admin';

const App: React.FC = () => {
  const [activeVertical, setActiveVertical] = useState<Vertical>('stays');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<Offer[]>([]);
  const [searchHasRun, setSearchHasRun] = useState(false);
  const [currency, setCurrency] = useState<'USD' | 'EUR'>('USD');
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  
  // Search Form State
  const [destination, setDestination] = useState('New York');
  
  // Date State with Defaults (Today + 3 days)
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d;
  });

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          const data = await response.json();
          setUserProfile(data.profile);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };
    fetchProfile();
  }, []);

  const handleSearch = async () => {
    setIsSearching(true);
    setSearchHasRun(true);
    setResults([]); // clear previous
    
    try {
      const data = await searchOffers(activeVertical);
      setResults(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  const tabs = [
    { id: 'stays', icon: <Bed size={18} />, label: 'Stays' },
    { id: 'flights', icon: <Plane size={18} />, label: 'Flights' },
    { id: 'cars', icon: <Car size={18} />, label: 'Cars' },
    { id: 'packages', icon: <Package size={18} />, label: 'Packages' },
    { id: 'cruises', icon: <Anchor size={18} />, label: 'Cruises' },
    { id: 'things-to-do', icon: <Ticket size={18} />, label: 'Things to do' },
  ];

  const displayName = userProfile ? `${userProfile.firstName}` : 'Guest';
  const avatar = userProfile?.avatar || 'https://i.pravatar.cc/300?img=11';

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-orange-50/30 selection:bg-orange-200 selection:text-orange-900">
      {/* 1. Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-orange-100 sticky top-0 z-40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div 
              onClick={() => setCurrentView('home')}
              className="text-2xl font-black tracking-tight text-orange-600 flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer"
            >
              <div className="bg-gradient-to-tr from-orange-500 to-red-500 text-white p-1.5 rounded-lg shadow-sm">
                <Plane className="fill-current" size={20} />
              </div>
              <span><span className="text-gray-900">Alo</span>Trips</span>
            </div>
            <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
              <span onClick={() => setCurrentView('home')} className="hover:text-orange-600 cursor-pointer transition-colors relative group">
                Shop Travel
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-orange-500 transition-all ${currentView === 'home' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </span>
              <span className="hover:text-orange-600 cursor-pointer transition-colors relative group">
                Get the app
                 <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all group-hover:w-full"></span>
              </span>
            </nav>
          </div>
          
          <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
             <button className="flex items-center gap-1 hover:bg-orange-50 hover:text-orange-700 px-3 py-1.5 rounded-full transition-all">
               <Globe size={16} /> English
             </button>

             {/* Currency Selector */}
             <div className="relative group z-50">
                <button className="flex items-center gap-1 hover:bg-orange-50 hover:text-orange-700 px-3 py-1.5 rounded-full transition-all">
                    {currency === 'USD' ? <DollarSign size={16} /> : <Euro size={16} />} 
                    {currency}
                </button>
                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl hidden group-hover:block min-w-[100px] py-1 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <button 
                        onClick={() => setCurrency('USD')} 
                        className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-orange-50 transition-colors ${currency === 'USD' ? 'text-orange-600 font-bold' : 'text-gray-600'}`}
                    >
                        <DollarSign size={14} /> USD
                    </button>
                    <button 
                        onClick={() => setCurrency('EUR')} 
                        className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-orange-50 transition-colors ${currency === 'EUR' ? 'text-orange-600 font-bold' : 'text-gray-600'}`}
                    >
                        <Euro size={14} /> EUR
                    </button>
                </div>
             </div>

             {/* User Menu */}
             <div className="relative z-50">
               <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="hidden md:flex items-center gap-2 hover:bg-orange-50 pl-2 pr-4 py-1.5 rounded-full transition-all border border-transparent hover:border-orange-100"
               >
                 <img src={avatar} className="w-8 h-8 rounded-full border border-gray-200" alt="Avatar"/>
                 <span className="font-semibold text-gray-700">{displayName}</span>
               </button>
               
               {isUserMenuOpen && (
                 <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                       <p className="text-sm font-bold text-gray-900">{userProfile?.firstName || 'Guest'} {userProfile?.lastName || ''}</p>
                       <p className="text-xs text-gray-500">{userProfile?.email || 'guest@example.com'}</p>
                    </div>
                    <div className="p-1">
                       <button 
                         onClick={() => { setCurrentView('profile'); setIsUserMenuOpen(false); }}
                         className="w-full text-left px-4 py-2 text-sm flex items-center gap-3 hover:bg-orange-50 rounded-lg transition-colors text-gray-700"
                       >
                         <User size={16}/> My Profile
                       </button>
                       <button 
                         onClick={() => { setCurrentView('admin'); setIsUserMenuOpen(false); }}
                         className="w-full text-left px-4 py-2 text-sm flex items-center gap-3 hover:bg-orange-50 rounded-lg transition-colors text-gray-700"
                       >
                         <LayoutDashboard size={16}/> Admin Panel
                       </button>
                       <div className="h-px bg-gray-100 my-1"></div>
                       <button 
                          className="w-full text-left px-4 py-2 text-sm flex items-center gap-3 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                        >
                         <LogOut size={16}/> Sign Out
                       </button>
                    </div>
                 </div>
               )}
               {/* Click outside closer overlay */}
               {isUserMenuOpen && (
                 <div className="fixed inset-0 z-[-1]" onClick={() => setIsUserMenuOpen(false)}></div>
               )}
             </div>

             <button className="md:hidden p-2 hover:bg-orange-50 rounded-lg text-gray-600">
               <Menu size={24}/>
             </button>
          </div>
        </div>
      </header>

      {/* VIEW SWITCHER */}
      
      {/* 1. HOME VIEW */}
      {currentView === 'home' && (
        <>
          {/* Search Hero Area */}
          <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 py-12 px-4 md:pb-24 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                 <div className="absolute -top-24 -left-24 w-96 h-96 bg-yellow-300 rounded-full blur-3xl mix-blend-overlay animate-pulse"></div>
                 <div className="absolute top-1/2 right-0 w-64 h-64 bg-red-400 rounded-full blur-3xl mix-blend-overlay"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
               <h1 className="text-4xl md:text-6xl font-black text-white mb-8 text-center md:text-left drop-shadow-sm tracking-tight">
                 Explore the world, <br className="hidden md:block"/>
                 <span className="text-yellow-200">one click at a time.</span>
               </h1>
               
               {/* Search Box Container */}
               <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-4 md:p-8 border border-white/20">
                  {/* Tabs */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-6 no-scrollbar mb-2 border-b border-gray-100">
                     {tabs.map((tab) => (
                       <button 
                         key={tab.id}
                         onClick={() => setActiveVertical(tab.id as Vertical)}
                         className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-bold transition-all duration-300 ${
                           activeVertical === tab.id 
                           ? 'bg-orange-600 text-white shadow-lg shadow-orange-200 scale-105' 
                           : 'bg-transparent text-gray-500 hover:bg-orange-50 hover:text-orange-600'
                         }`}
                       >
                         {tab.icon} {tab.label}
                       </button>
                     ))}
                  </div>

                  {/* Input Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                     <div className="md:col-span-5 relative group">
                        <label className="absolute left-11 top-3 text-xs text-gray-500 font-bold uppercase tracking-wider group-focus-within:text-orange-600 transition-colors">
                           {activeVertical === 'cars' ? 'Pick-up Location' : 'Where to?'}
                        </label>
                        <MapPin className="absolute left-4 top-4.5 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={20} />
                        <input 
                          type="text" 
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          className="w-full h-16 pl-11 pt-5 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none font-bold text-gray-900 text-lg transition-all shadow-inner"
                        />
                     </div>
                     
                     <div className="md:col-span-3">
                        <DateRangePicker 
                          startDate={startDate} 
                          endDate={endDate} 
                          onChange={(start, end) => {
                            setStartDate(start);
                            setEndDate(end);
                          }} 
                        />
                     </div>

                     <div className="md:col-span-3 relative group">
                        <label className="absolute left-11 top-3 text-xs text-gray-500 font-bold uppercase tracking-wider group-focus-within:text-orange-600 transition-colors">Travelers</label>
                        <User className="absolute left-4 top-4.5 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={20} />
                        <input 
                          type="text" 
                          defaultValue={activeVertical === 'cars' ? "1 Driver" : "2 travelers"}
                          className="w-full h-16 pl-11 pt-5 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none font-bold text-gray-900 text-lg transition-all shadow-inner"
                        />
                     </div>

                     <div className="md:col-span-1">
                        <button 
                          onClick={handleSearch}
                          disabled={isSearching}
                          className="w-full h-16 bg-gradient-to-br from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-2xl flex items-center justify-center transition-all shadow-lg hover:shadow-orange-300/50 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                        >
                          {isSearching ? (
                            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                          ) : (
                            <Search size={28} strokeWidth={2.5} />
                          )}
                        </button>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Main Content Area */}
          <main className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-4 gap-8 flex-grow w-full">
            
            {/* Left Sidebar (Filters) */}
            <aside className="hidden lg:block space-y-6">
               {searchHasRun && (
                 <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 group cursor-pointer hover:shadow-md transition-all">
                      <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <MapPin size={18} className="text-orange-500"/> Map View
                      </h3>
                      <div className="h-32 bg-orange-50 rounded-xl flex items-center justify-center text-orange-400 group-hover:bg-orange-100 transition-colors border-2 border-dashed border-orange-200">
                         <span className="text-sm font-bold">Show interactive map</span>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                       <h3 className="font-bold text-gray-900 mb-5">Filters</h3>
                       
                       <div className="mb-6">
                         <h4 className="text-sm font-bold text-gray-700 mb-3">Price Range</h4>
                         <input type="range" className="w-full accent-orange-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                       </div>

                       <div className="space-y-3">
                          <h4 className="text-sm font-bold text-gray-700">Popular Filters</h4>
                          {['Breakfast Included', 'Pool', 'Free cancellation', 'Pet friendly'].map(f => (
                            <label key={f} className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer hover:text-orange-600 transition-colors">
                               <input type="checkbox" className="w-5 h-5 rounded text-orange-600 focus:ring-orange-500 border-gray-300" />
                               {f}
                            </label>
                          ))}
                       </div>
                    </div>
                 </div>
               )}
               
               {!searchHasRun && (
                 <div className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-2xl border border-orange-100 shadow-sm">
                   <h3 className="text-orange-900 font-bold mb-3 text-lg">Why AloTrips?</h3>
                   <ul className="text-sm text-gray-700 space-y-3">
                     <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>Compare hundreds of sites</li>
                     <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>Best Value EPC Engine</li>
                     <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>No hidden booking fees</li>
                   </ul>
                 </div>
               )}
            </aside>

            {/* Results Column */}
            <div className="lg:col-span-3">
               
               {/* Loading Skeleton */}
               {isSearching && (
                 <div className="space-y-6">
                   {[1,2,3].map(i => (
                     <div key={i} className="h-56 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 animate-pulse flex gap-4">
                        <div className="w-48 bg-gray-200 rounded-xl h-full"></div>
                        <div className="flex-1 py-2 space-y-3">
                            <div className="w-3/4 h-6 bg-gray-200 rounded"></div>
                            <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
                            <div className="w-full h-20 bg-gray-100 rounded mt-4"></div>
                        </div>
                     </div>
                   ))}
                 </div>
               )}

               {/* Results List */}
               {searchHasRun && !isSearching && results.length > 0 && (
                 <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                   
                   {/* Context Header */}
                   <div className="flex justify-between items-center mb-6">
                     <h2 className="text-xl font-bold text-gray-800">
                        <span className="text-orange-600">{results.length}</span> properties in {destination}
                     </h2>
                     <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                        Sort by: <span className="font-bold text-orange-600">Recommended</span>
                     </div>
                   </div>

                   {/* Price History Chart */}
                   {activeVertical === 'flights' && (
                     <PriceTrendChart 
                       destination={destination}
                       currency={currency}
                     />
                   )}

                   {/* Upsell Logic */}
                   <div className="transform hover:scale-[1.01] transition-transform duration-300">
                      {activeVertical === 'flights' ? <UpsellBanner type="insurance" /> : <UpsellBanner type="esim" />}
                   </div>

                   <div className="space-y-5">
                     {results.map((offer, index) => (
                       <div key={offer.id} className="animate-in fade-in slide-in-from-bottom-4" style={{animationDelay: `${index * 100}ms`}}>
                         <OfferCard 
                           offer={{
                              ...offer,
                              currency: currency,
                              total_price: currency === 'EUR' ? offer.total_price * 0.92 : offer.total_price
                           }} 
                           vertical={activeVertical} 
                         />
                       </div>
                     ))}
                   </div>
                   
                   <p className="text-center text-xs text-gray-400 mt-10">
                     *Prices include estimated taxes and fees.
                   </p>
                 </div>
               )}

               {/* Insurance Upsell Section */}
               {searchHasRun && !isSearching && (
                  <div className="mt-10 mb-4 border-t border-gray-200 pt-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 px-1 flex items-center gap-2">
                        <Sunset size={20} className="text-orange-500"/> Travel Protection
                    </h3>
                    <UpsellBanner type="insurance" />
                  </div>
               )}

               {/* Empty State */}
               {searchHasRun && !isSearching && results.length === 0 && (
                 <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <div className="bg-orange-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search className="text-orange-400" size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">We couldn't find anything matching your criteria. Try changing your dates or destination.</p>
                 </div>
               )}

               {/* Initial State Content: Deal Showcase */}
               {!searchHasRun && (
                 <DealShowcase />
               )}
            </div>
          </main>
        </>
      )}

      {/* 2. PROFILE VIEW */}
      {currentView === 'profile' && (
        <main className="flex-grow bg-gray-50/30">
           <UserProfilePage />
        </main>
      )}

      {/* 3. ADMIN VIEW */}
      {currentView === 'admin' && (
        <main className="flex-grow">
           <AdminPanel />
        </main>
      )}

      {currentView !== 'admin' && <Footer />}
      <CookieBanner />
      <GeminiAssistant />
    </div>
  );
};

export default App;

