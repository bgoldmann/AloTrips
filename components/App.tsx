'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Vertical, SearchParams, Offer, TripType, UserProfile } from '../types';
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
import LocationAutocomplete from './LocationAutocomplete';
import TravelersSelector, { TravelersConfig } from './TravelersSelector';
import TripTypeSelector from './TripTypeSelector';
import ResultsToolbar from './ResultsToolbar';
import FiltersPanel from './FiltersPanel';
import UpsellRecommendation from './UpsellRecommendation';
import MapView from './MapView';
import PackageOfferCard from './PackageOfferCard';
import ActivityOfferCard from './ActivityOfferCard';
import CruiseOfferCard from './CruiseOfferCard';
import ProviderDownNotice from './ProviderDownNotice';
import FlexibleDatePicker from './FlexibleDatePicker';
import MultiCityFlightForm, { FlightSegment } from './MultiCityFlightForm';
import SavedTripsPanel from './SavedTripsPanel';
import WishlistPanel from './WishlistPanel';
import CrossVerticalLinks from './CrossVerticalLinks';
import PopularDestinations from './PopularDestinations';
import { filterAndSortOffers } from '@/lib/filters';
import { FilterState, SortOption } from '@/types';
import { getUpsellRecommendation, TripContext } from '@/lib/upsells/rules';
import { PackageOffer } from '@/lib/packages/bundler';
import { convertCurrencySync, getCurrencySymbol, Currency, getCachedRate, prefetchExchangeRates } from '@/lib/currency';
import { 
  Plane, Bed, Car, Package, Anchor, Ticket, 
  Search, MapPin, User, Menu, Globe, DollarSign, Euro, Sunset, LogOut, Settings, LayoutDashboard, Heart, ArrowRight, Star
} from 'lucide-react';

type AppView = 'home' | 'profile' | 'admin';

const App: React.FC = () => {
  const [activeVertical, setActiveVertical] = useState<Vertical>('stays');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<Offer[]>([]);
  const [searchHasRun, setSearchHasRun] = useState(false);
  const [currency, setCurrency] = useState<Currency>('USD');
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  // Search Form State
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('NYC');
  const [tripType, setTripType] = useState<TripType>('round-trip');
  const [travelers, setTravelers] = useState<TravelersConfig>({
    adults: 2,
    children: 0,
    rooms: 1,
  });
  
  // Date State with Defaults (Today + 3 days)
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d;
  });
  const [flexibleDays, setFlexibleDays] = useState(0);
  const [includeNearbyAirports, setIncludeNearbyAirports] = useState(false);
  
  // Multi-city flights state
  const [flightSegments, setFlightSegments] = useState<FlightSegment[]>([
    { origin: '', destination: '', date: new Date() },
  ]);

  // Validation errors
  const [errors, setErrors] = useState<{
    origin?: string;
    destination?: string;
    startDate?: string;
    endDate?: string;
    travelers?: string;
  }>({});

  // Filters and Sorting
  const [filters, setFilters] = useState<FilterState>({});
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const [showFilters, setShowFilters] = useState(false);
  const [rawResults, setRawResults] = useState<Offer[]>([]); // Store unfiltered results
  const [packageResults, setPackageResults] = useState<PackageOffer[]>([]); // Store package offers
  
  // Upsell recommendation
  const [upsellRecommendation, setUpsellRecommendation] = useState<ReturnType<typeof getUpsellRecommendation>>(null);
  
  // Map view state
  const [showMapView, setShowMapView] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState<string | undefined>();
  
  // Wishlist view state
  const [showWishlist, setShowWishlist] = useState(false);

  // Apply filters and sorting when they change (if results already exist)
  useEffect(() => {
    if (rawResults.length > 0) {
      const processedResults = filterAndSortOffers(rawResults, filters, sortBy, activeVertical);
      setResults(processedResults);
    }
    // Note: rawResults intentionally excluded from deps to prevent infinite loops
    // We only want to re-filter when filters/sort/vertical changes, not when rawResults updates
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sortBy, activeVertical]);

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          const data = await response.json();
          setUserProfile(data.profile);
          // Set currency from user preference
          if (data.profile?.currencyPreference) {
            setCurrency(data.profile.currencyPreference as Currency);
          }
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };
    fetchProfile();
  }, []);

  // Prefetch exchange rates when currency changes
  useEffect(() => {
    const fetchRates = async () => {
      if (currency !== 'USD') {
        try {
          const response = await fetch(`/api/currency/rates?from=USD&to=${currency}`);
          if (response.ok) {
            const data = await response.json();
            setExchangeRates(prev => ({
              ...prev,
              [`USD_${currency}`]: data.rate,
            }));
          }
        } catch (error) {
          console.error('Failed to fetch exchange rates:', error);
        }
      }
    };
    fetchRates();
  }, [currency]);

  const validateSearch = (): boolean => {
    const newErrors: typeof errors = {};

    // Validate destination (required for all verticals)
    if (!destination || destination.trim().length === 0) {
      newErrors.destination = 'Destination is required';
    }

    // Validate origin for flights
    if (activeVertical === 'flights' && tripType !== 'multi-city') {
      if (!origin || origin.trim().length === 0) {
        newErrors.origin = 'Origin is required for flights';
      }
    }

    // Validate dates
    if (!startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (activeVertical !== 'flights' || tripType === 'round-trip') {
      if (!endDate) {
        newErrors.endDate = 'End date is required';
      } else if (startDate && endDate && endDate < startDate) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    // Validate travelers
    if (travelers.adults === 0 && travelers.children === 0) {
      newErrors.travelers = 'At least one traveler is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = async () => {
    // Validate before searching
    if (!validateSearch()) {
      return;
    }

    setIsSearching(true);
    setSearchHasRun(true);
    setResults([]); // clear previous
    
    try {
      // Build search parameters
      const searchParams: SearchParams = {
        origin: activeVertical === 'flights' ? origin : undefined,
        destination,
        startDate: startDate?.toISOString().split('T')[0] || '',
        endDate: (activeVertical !== 'flights' || tripType === 'round-trip') 
          ? (endDate?.toISOString().split('T')[0] || '')
          : undefined,
        travelers: travelers.adults + travelers.children,
        adults: travelers.adults,
        children: travelers.children,
        rooms: activeVertical === 'stays' ? travelers.rooms : undefined,
        tripType: activeVertical === 'flights' ? tripType : undefined,
        includeNearbyAirports: activeVertical === 'flights' ? includeNearbyAirports : undefined,
        flexibleDays: flexibleDays > 0 ? flexibleDays : undefined,
        flightSegments: activeVertical === 'flights' && tripType === 'multi-city' && flightSegments.length > 0 
          ? flightSegments.map(seg => ({
              origin: seg.origin,
              destination: seg.destination,
              date: seg.date instanceof Date ? seg.date.toISOString().split('T')[0] : seg.date,
            }))
          : undefined,
      };

      // For packages, call API directly to get bundled results
      if (activeVertical === 'packages') {
        try {
          const params = new URLSearchParams({
            vertical: activeVertical,
            destination: searchParams.destination,
            startDate: searchParams.startDate,
            travelers: String(searchParams.travelers),
          });
          
          if (searchParams.endDate) params.append('endDate', searchParams.endDate);
          if (searchParams.origin) params.append('origin', searchParams.origin);
          if (searchParams.adults) params.append('adults', String(searchParams.adults));
          if (searchParams.children) params.append('children', String(searchParams.children));
          if (searchParams.rooms) params.append('rooms', String(searchParams.rooms));
          if (searchParams.tripType) params.append('tripType', searchParams.tripType);
          if (searchParams.flightSegments && searchParams.flightSegments.length > 0) {
            params.append('flightSegments', JSON.stringify(searchParams.flightSegments));
          }
          
          const response = await fetch(`/api/search?${params.toString()}`);
          
          if (!response.ok) {
            throw new Error(`Search failed: ${response.statusText}`);
          }
          
          const responseData = await response.json();
          
          if (responseData.packages && Array.isArray(responseData.offers)) {
            setPackageResults(responseData.offers as PackageOffer[]);
            setResults([]);
            setRawResults([]);
          } else {
            setPackageResults([]);
            setResults([]);
            setRawResults([]);
          }
        } catch (packageError) {
          console.error('Package search error:', packageError);
          setPackageResults([]);
          setResults([]);
          setRawResults([]);
        }
      } else {
        const data = await searchOffers(activeVertical, searchParams);
        // Store raw results
        setRawResults(data);
        // Apply filters and sorting to results
        const processedResults = filterAndSortOffers(data, filters, sortBy, activeVertical);
        setResults(processedResults);
        
        // Generate upsell recommendation based on trip context
        const tripContext: TripContext = {
          vertical: activeVertical,
          searchParams,
          offers: data,
          destination,
          origin,
        };
        const recommendation = getUpsellRecommendation(tripContext);
        setUpsellRecommendation(recommendation);
      }
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
                <button 
                    className="flex items-center gap-1 hover:bg-orange-50 hover:text-orange-700 px-3 py-1.5 rounded-full transition-all"
                    aria-label="Currency selector"
                    aria-expanded="false"
                    aria-haspopup="true"
                >
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
                    aria-label="User menu"
                    {...(isUserMenuOpen ? { 'aria-expanded': true } : { 'aria-expanded': false })}
                    aria-haspopup="true"
                  >
                 <Image src={avatar} width={32} height={32} className="rounded-full border border-gray-200" alt="Avatar" unoptimized={avatar?.includes('pravatar.cc')}/>
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

             <button 
               className="md:hidden p-2 hover:bg-orange-50 rounded-lg text-gray-600"
               aria-label="Open mobile menu"
             >
               <Menu size={24} aria-hidden="true" />
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

                  {/* Trip Type Selector (Flights only) */}
                  {activeVertical === 'flights' && (
                    <div className="mb-4 space-y-3">
                      <TripTypeSelector value={tripType} onChange={setTripType} />
                      
                      {/* Nearby Airports Toggle */}
                      {tripType !== 'multi-city' && (
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                          <input
                            type="checkbox"
                            id="nearby-airports"
                            checked={includeNearbyAirports}
                            onChange={(e) => setIncludeNearbyAirports(e.target.checked)}
                            className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                          />
                          <label htmlFor="nearby-airports" className="text-sm font-semibold text-gray-700 cursor-pointer flex items-center gap-2">
                            <MapPin size={16} className="text-orange-500" />
                            Include nearby airports
                            <span className="text-xs text-gray-500 font-normal">(More options, potentially better prices)</span>
                          </label>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Multi-city Flight Form */}
                  {activeVertical === 'flights' && tripType === 'multi-city' && (
                    <div className="mb-4">
                      <MultiCityFlightForm
                        segments={flightSegments}
                        onChange={setFlightSegments}
                        onDateChange={(index, date) => {
                          const updated = [...flightSegments];
                          updated[index] = { ...updated[index], date };
                          setFlightSegments(updated);
                        }}
                      />
                    </div>
                  )}

                  {/* Input Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                     {/* Origin (Flights only) */}
                     {activeVertical === 'flights' && tripType !== 'multi-city' && (
                       <div className="md:col-span-5 relative group">
                         <LocationAutocomplete
                           value={origin}
                           onChange={setOrigin}
                           placeholder="From?"
                           label="From"
                           type="airport"
                           required
                           error={errors.origin}
                         />
                       </div>
                     )}

                     {/* Destination */}
                     <div className={`relative group ${activeVertical === 'flights' && tripType !== 'multi-city' ? 'md:col-span-5' : 'md:col-span-6'}`}>
                       <LocationAutocomplete
                         value={destination}
                         onChange={setDestination}
                         placeholder={activeVertical === 'cars' ? 'Pick-up Location' : 'Where to?'}
                         label={activeVertical === 'cars' ? 'Pick-up Location' : 'Where to?'}
                         type={activeVertical === 'flights' ? 'airport' : 'city'}
                         required
                         error={errors.destination}
                       />
                     </div>
                     
                     {/* Date Range - Use FlexibleDatePicker for flights, regular for others */}
                     <div className="md:col-span-3">
                        {activeVertical === 'flights' ? (
                          <FlexibleDatePicker
                            startDate={startDate}
                            endDate={endDate}
                            showEndDate={tripType === 'round-trip'}
                            flexibleDays={flexibleDays}
                            onChange={(start, end, days) => {
                              setStartDate(start);
                              setEndDate(end);
                              if (days !== undefined) setFlexibleDays(days);
                            }}
                            error={errors.startDate || errors.endDate}
                          />
                        ) : (
                          <DateRangePicker 
                            startDate={startDate} 
                            endDate={endDate}
                            showEndDate={true}
                            onChange={(start, end) => {
                              setStartDate(start);
                              setEndDate(end);
                            }}
                            error={errors.startDate || errors.endDate}
                          />
                        )}
                     </div>

                     {/* Travelers */}
                     <div className="md:col-span-3 relative group">
                       <TravelersSelector
                         value={travelers}
                         onChange={setTravelers}
                         showRooms={activeVertical === 'stays'}
                         label={activeVertical === 'cars' ? 'Drivers' : 'Travelers'}
                         error={errors.travelers}
                       />
                     </div>

                     {/* Search Button */}
                     <div className="md:col-span-1">
                        <button 
                          onClick={handleSearch}
                          disabled={isSearching}
                          className="w-full h-16 bg-gradient-to-br from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-2xl flex items-center justify-center transition-all shadow-lg hover:shadow-orange-300/50 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                          aria-label={isSearching ? 'Searching for travel deals...' : 'Search for travel deals'}
                        >
                          {isSearching ? (
                            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true"></div>
                          ) : (
                            <Search size={28} strokeWidth={2.5} aria-hidden="true" />
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
                    <SavedTripsPanel
                      userId={userProfile?.id}
                      onLoadTrip={(trip) => {
                        // Load trip data into search form
                        setActiveVertical(trip.vertical);
                        if (trip.search_params.origin) setOrigin(trip.search_params.origin);
                        setDestination(trip.search_params.destination);
                        if (trip.search_params.startDate) setStartDate(new Date(trip.search_params.startDate));
                        if (trip.search_params.endDate) setEndDate(new Date(trip.search_params.endDate));
                        if (trip.search_params.tripType) setTripType(trip.search_params.tripType);
                        if (trip.flexible_days) setFlexibleDays(trip.flexible_days);
                        if (trip.flight_segments) setFlightSegments(trip.flight_segments);
                        // Trigger search
                        setTimeout(() => handleSearch(), 100);
                      }}
                    />
                    
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                          <MapPin size={18} className="text-orange-500"/> Map View
                        </h3>
                        <button
                          onClick={() => setShowMapView(!showMapView)}
                          className="text-sm text-orange-600 hover:text-orange-700 font-semibold"
                        >
                          {showMapView ? 'Hide' : 'Show'} Map
                        </button>
                      </div>
                      {showMapView && (
                        <div className="h-64 rounded-xl overflow-hidden">
                          <MapView
                            offers={rawResults.length > 0 ? rawResults : results}
                            vertical={activeVertical}
                            onMarkerClick={(offer) => {
                              setSelectedOfferId(offer.id);
                              // Scroll to offer in list
                              const element = document.getElementById(`offer-${offer.id}`);
                              if (element) {
                                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              }
                            }}
                            selectedOfferId={selectedOfferId}
                          />
                        </div>
                      )}
                      {!showMapView && (
                        <div className="h-32 bg-orange-50 rounded-xl flex items-center justify-center text-orange-400 cursor-pointer hover:bg-orange-100 transition-colors border-2 border-dashed border-orange-200"
                             onClick={() => setShowMapView(true)}
                        >
                          <span className="text-sm font-bold">Click to show interactive map</span>
                        </div>
                      )}
                    </div>

                    <FiltersPanel
                      vertical={activeVertical}
                      filters={filters}
                      onFiltersChange={setFilters}
                      onClear={() => setFilters({})}
                      isOpen={true}
                      onClose={() => {}}
                    />
                 </div>
               )}
               
               {!searchHasRun && (
                 <>
                   <div className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-2xl border border-orange-100 shadow-sm">
                     <h3 className="text-orange-900 font-bold mb-3 text-lg">Why AloTrips?</h3>
                     <ul className="text-sm text-gray-700 space-y-3">
                       <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>Compare hundreds of sites</li>
                       <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>Best Value EPC Engine</li>
                       <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>No hidden booking fees</li>
                     </ul>
                   </div>
                   <button
                     onClick={() => setShowWishlist(!showWishlist)}
                     className="w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex items-center justify-between group"
                   >
                     <div className="flex items-center gap-3">
                       <Heart size={20} className="text-red-500 fill-red-500" />
                       <span className="font-semibold text-gray-900">My Wishlist</span>
                     </div>
                     <ArrowRight size={16} className="text-gray-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                   </button>
                   <SavedTripsPanel userId={userProfile?.id} />
                 </>
               )}
               
               {/* Wishlist Panel */}
               {showWishlist && (
                 <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                   <WishlistPanel 
                     userId={userProfile?.id} 
                     onClose={() => setShowWishlist(false)}
                   />
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
               {searchHasRun && !isSearching && (
                 <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                   
                   {/* Results Toolbar */}
                   {results.length > 0 && (
                     <>
                       <ResultsToolbar
                         vertical={activeVertical}
                         sortBy={sortBy}
                         onSortChange={setSortBy}
                         resultCount={activeVertical === 'packages' ? packageResults.length : results.length}
                         onFilterToggle={() => setShowFilters(!showFilters)}
                         showFilters={showFilters}
                       />

                       {/* Mobile Filters Panel */}
                       {showFilters && (
                         <div className="lg:hidden mb-6">
                           <FiltersPanel
                             vertical={activeVertical}
                             filters={filters}
                             onFiltersChange={setFilters}
                             onClear={() => setFilters({})}
                             isOpen={showFilters}
                             onClose={() => setShowFilters(false)}
                           />
                         </div>
                       )}
                     </>
                   )}

                   {/* Price History Chart */}
                   {activeVertical === 'flights' && (
                     <PriceTrendChart 
                       destination={destination}
                       currency={currency === 'USD' || currency === 'EUR' ? currency : 'USD'}
                     />
                   )}

                   {/* Upsell Recommendation */}
                   {upsellRecommendation && (
                     <div className="transform hover:scale-[1.01] transition-transform duration-300">
                       <UpsellRecommendation 
                         recommendation={upsellRecommendation}
                         onDismiss={() => setUpsellRecommendation(null)}
                       />
                     </div>
                   )}

                       {/* Regular Results */}
                       {activeVertical !== 'packages' && results.length > 0 && (
                         <div className="space-y-5">
                           {results.map((offer, index) => (
                             <div 
                               key={offer.id} 
                               id={`offer-${offer.id}`}
                               className={`animate-in fade-in slide-in-from-bottom-4 transition-all ${
                                 selectedOfferId === offer.id ? 'ring-2 ring-orange-500 rounded-2xl p-2' : ''
                               }`}
                               onMouseEnter={() => setSelectedOfferId(offer.id)}
                               onMouseLeave={() => setSelectedOfferId(undefined)}
                             >
                               {activeVertical === 'things-to-do' ? (
                                 <ActivityOfferCard 
                                   offer={offer}
                                 />
                               ) : activeVertical === 'cruises' ? (
                                 <CruiseOfferCard
                                   offer={offer}
                                 />
                               ) : (
                                 <OfferCard 
                                   offer={offer}
                                   vertical={activeVertical}
                                 />
                               )}
                             </div>
                           ))}
                         </div>
                       )}

                       {/* No Results */}
                       {activeVertical !== 'packages' && results.length === 0 && searchHasRun && !isSearching && (
                         <div className="text-center py-12">
                           <p className="text-gray-500 text-lg">No results found. Try adjusting your search criteria.</p>
                         </div>
                       )}
                   
                   <div className="mt-10 space-y-2">
                     <p className="text-center text-xs text-gray-400">
                       *Prices include estimated taxes and fees. Final prices may vary. <Link href="/terms" className="text-orange-500 hover:text-orange-600 underline">See price accuracy disclaimer</Link>.
                     </p>
                     <p className="text-center text-xs text-gray-400">
                       We may earn a commission when you book through our links. <Link href="/terms" className="text-orange-500 hover:text-orange-600 underline">Learn more</Link>.
                     </p>
                   </div>
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
                 <>
                   {/* Member Deals Section */}
                   {userProfile && userProfile.tier && (
                     <div className="mb-10">
                       <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-6 mb-6">
                         <div className="flex items-center justify-between mb-4">
                           <div>
                             <h3 className="text-xl font-black text-gray-900 mb-1 flex items-center gap-2">
                               <Star size={20} className="text-purple-500 fill-purple-500" />
                               {userProfile.tier} Member Exclusive Deals
                             </h3>
                             <p className="text-sm text-gray-600">Special prices just for you</p>
                           </div>
                           <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wide">
                             {userProfile.tier}
                           </span>
                         </div>
                         <p className="text-sm text-gray-600">
                           Log in to see exclusive member prices on select offers. Look for the <span className="font-bold text-purple-600">Member</span> badge!
                         </p>
                       </div>
                     </div>
                   )}
                   <DealShowcase />
                   <div className="mt-10">
                     <PopularDestinations />
                   </div>
                   <div className="mt-10">
                     <CrossVerticalLinks destination={destination} />
                   </div>
                 </>
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

