'use client';

import React, { useState } from 'react';
import { Facebook, Twitter, Youtube, MessageCircle, Globe, Mail } from 'lucide-react';

const RECOMMENDATION_TABS = [
  'Popular Hotels', 'Popular Flights', 'Popular Attractions', 'Hot Deals', 
  'Featured Travel Guide', 'AloTrips Links', 'Top Car Rental Spots', 
  'Explore more', 'Popular Activities'
];

const RECOMMENDATION_LINKS: Record<string, string[]> = {
  'Popular Hotels': [
    'Best Hotels in Shanghai', 'Best Hotels in Hong Kong', 'Best Hotels in Las Vegas', 'Best Hotels in Bangkok', 'Best Hotels in Beijing',
    'Best Hotels in Guangzhou', 'Best Hotels in NYC', 'Best Hotels in Singapore', 'Best Hotels in Kuala Lumpur', 'Best Hotels in Dubai',
    'Best Hotels in Chicago', 'Best Hotels in San Diego', 'Best Hotels in Miami', 'Best Hotels in New Orleans', 'Best Hotels in Nashville',
    'Best Hotels in Boston', 'Best Hotels in Orlando', 'Best Hotels in Savannah', 'Best Hotels in Charleston', 'Best Hotels in Los Angeles',
    'Best Hotels in Da Nang'
  ],
  'Popular Flights': [
    'Flights to New York', 'Flights to London', 'Flights to Paris', 'Flights to Tokyo', 'Flights to Dubai',
    'Flights to Singapore', 'Flights to Los Angeles', 'Flights to Bangkok', 'Flights to Hong Kong', 'Flights to Sydney'
  ],
  // Fallback for others to keep the UI functional without infinite lists
  'default': [
    'Travel Guide to Asia', 'European Getaways', 'US Road Trips', 'Beach Vacations', 'Mountain Retreats',
    'City Breaks', 'Family Holidays', 'Romantic Escapes', 'Solo Travel Tips', 'Adventure Travel'
  ]
};

const Footer: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Popular Hotels');

  const linksToShow = RECOMMENDATION_LINKS[activeTab] || RECOMMENDATION_LINKS['default'];

  return (
    <footer className="bg-white pt-16 border-t border-gray-100 mt-auto">
      
      {/* 1. Recommendations Section */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
            AloTrips Recommendations
            <div className="h-1 w-12 bg-orange-500 rounded-full"></div>
        </h2>
        
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {RECOMMENDATION_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                activeTab === tab 
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-200' 
                  : 'bg-gray-100 text-gray-500 hover:bg-orange-50 hover:text-orange-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Link Grid */}
        <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-4 gap-x-6">
            {linksToShow.map((link, idx) => (
              <a 
                key={idx} 
                href="#" 
                className="text-xs text-gray-500 hover:text-orange-600 hover:translate-x-1 transition-all truncate font-medium"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 border-t border-gray-100">
        
        {/* Column 1: Contact Us */}
        <div>
          <h3 className="font-bold text-gray-900 mb-5">Contact Us</h3>
          <ul className="space-y-3 text-sm text-gray-500">
            <li><a href="#" className="hover:text-orange-600 transition-colors">Customer Support</a></li>
            <li><a href="#" className="hover:text-orange-600 transition-colors">Service Guarantee</a></li>
            <li><a href="#" className="hover:text-orange-600 transition-colors">More Service Info</a></li>
          </ul>
          
          <div className="mt-8 flex gap-4 text-gray-400">
            <a href="#" className="hover:text-blue-600 hover:scale-110 transition-all"><Facebook size={22} /></a>
            <a href="#" className="hover:text-blue-400 hover:scale-110 transition-all"><Twitter size={22} /></a>
            <a href="#" className="hover:text-green-500 hover:scale-110 transition-all"><MessageCircle size={22} /></a>
            <a href="#" className="hover:text-red-600 hover:scale-110 transition-all"><Youtube size={22} /></a>
          </div>
        </div>

        {/* Column 2: About */}
        <div>
          <h3 className="font-bold text-gray-900 mb-5">About</h3>
          <ul className="space-y-3 text-sm text-gray-500">
            <li><a href="#" className="hover:text-orange-600 transition-colors">About AloTrips.me</a></li>
            <li><a href="#" className="hover:text-orange-600 transition-colors">News</a></li>
            <li><a href="#" className="hover:text-orange-600 transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-orange-600 transition-colors">Terms & Conditions</a></li>
            <li><a href="#" className="hover:text-orange-600 transition-colors">Privacy Statement</a></li>
            <li><a href="#" className="hover:text-orange-600 transition-colors">Accessibility Statement</a></li>
            <li><a href="#" className="hover:text-orange-600 transition-colors">Do Not Sell My Personal Information</a></li>
            <li><a href="#" className="hover:text-orange-600 transition-colors">About AloTrips Group</a></li>
          </ul>
        </div>

        {/* Column 3: Other Services */}
        <div>
          <h3 className="font-bold text-gray-900 mb-5">Other Services</h3>
          <ul className="space-y-3 text-sm text-gray-500">
            <li><a href="#" className="hover:text-orange-600 transition-colors">Investor Relations</a></li>
            <li><a href="#" className="hover:text-orange-600 transition-colors">AloTrips Rewards</a></li>
            <li><a href="#" className="hover:text-orange-600 transition-colors">Affiliate Program</a></li>
            <li><a href="#" className="hover:text-orange-600 transition-colors">List Your Property</a></li>
            <li><a href="#" className="hover:text-orange-600 transition-colors">All Hotels</a></li>
            <li><a href="#" className="hover:text-orange-600 transition-colors">Become a Supplier</a></li>
            <li><a href="#" className="hover:text-orange-600 transition-colors">Security</a></li>
          </ul>
        </div>

        {/* Column 4: Payments & Partners */}
        <div>
           <h3 className="font-bold text-gray-900 mb-5">Payment Methods</h3>
           <div className="flex flex-wrap gap-2 mb-8">
             {['Pay', 'PayPal', 'UnionPay', 'Mastercard', 'Visa', 'Amex', 'JCB', 'Discover'].map((pm) => (
                <div key={pm} className="bg-white border border-gray-100 rounded-lg px-3 py-1.5 h-9 flex items-center justify-center min-w-[3.5rem] shadow-sm hover:shadow-md transition-shadow cursor-default">
                   <span className="text-[10px] font-bold text-gray-600">{pm}</span>
                </div>
             ))}
           </div>

           <h3 className="font-bold text-gray-900 mb-5">Our Partners</h3>
           <div className="flex gap-6 items-center opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0 duration-500">
              <span className="text-lg font-black text-gray-600 tracking-tighter">Google</span>
              <span className="text-lg font-bold text-gray-600 flex items-center gap-1"><Globe size={18} className="text-green-600"/> TripAdvisor</span>
           </div>
        </div>

      </div>

      {/* Copyright Bar */}
      <div className="bg-gray-900 border-t border-gray-800 py-8 text-center mt-6">
         <p className="text-xs text-gray-400 font-medium">
            Copyright © 2025 AloTrips.me. A <a href="https://goldmannllc.com" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-orange-400 hover:underline">Goldmann LLC</a> company. All rights reserved. 
         </p>
      </div>
    </footer>
  );
};

export default Footer;