import React, { useState } from 'react';
import { FEATURED_DEALS, STAY_STYLE_DEALS, BUNDLE_DEALS } from '../constants';
import { Timer, ArrowRight, Tag, ChevronDown, ChevronUp, Check } from 'lucide-react';

const Section: React.FC<{
  title: string;
  subtitle: string;
  deals: typeof FEATURED_DEALS;
}> = ({ title, subtitle, deals }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="mb-14 last:mb-0">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">{title}</h2>
          <p className="text-gray-500 mt-1 font-medium">{subtitle}</p>
        </div>
        <button className="hidden md:flex items-center gap-1 text-orange-600 font-bold hover:text-orange-700 transition hover:translate-x-1 duration-300">
          View all <ArrowRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {deals.map((deal) => (
          <div 
            key={deal.id} 
            onClick={(e) => toggleExpand(deal.id, e)}
            className="group bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col h-fit hover:-translate-y-2"
          >
            {/* Image Area */}
            <div className="relative h-56 overflow-hidden flex-shrink-0">
              <img 
                src={deal.image} 
                alt={deal.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" 
              />
              <div className="absolute top-4 left-4 bg-red-500/90 backdrop-blur-sm text-white text-[10px] uppercase font-black px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5 tracking-wide">
                <Tag size={12} className="fill-current" /> {deal.tag}
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5">
                 <div className="flex items-center text-white/95 text-xs gap-1.5 font-bold tracking-wide">
                    <div className="bg-orange-500 p-1 rounded-full animate-pulse">
                        <Timer size={10} className="text-white" />
                    </div>
                    Ends in {deal.expiresIn}
                 </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">{deal.title}</h3>
                <p className="text-sm text-gray-500 mb-5 font-medium">{deal.subtitle}</p>
              </div>

              <div className="flex items-end justify-between border-t border-gray-100 pt-5">
                 <div>
                    <span className="block text-xs text-gray-400 line-through font-bold">
                      ${deal.originalPrice}
                    </span>
                    <span className="block text-2xl font-black text-gray-900">
                      ${deal.price}
                    </span>
                 </div>
                 <div className="text-right flex flex-col items-end">
                    <span className="bg-emerald-100 text-emerald-700 text-xs font-black px-2.5 py-1 rounded-lg">
                      {deal.discount}
                    </span>
                    <button 
                      onClick={(e) => toggleExpand(deal.id, e)}
                      className="mt-3 text-sm font-bold text-orange-600 hover:text-orange-800 transition-colors flex items-center justify-end gap-1"
                    >
                      {expandedId === deal.id ? 'Show Less' : 'Details'}
                      {expandedId === deal.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                 </div>
              </div>

              {/* Expanded Details */}
              {expandedId === deal.id && (
                <div className="mt-5 pt-5 border-t border-gray-100 text-sm animate-in slide-in-from-top-4 fade-in duration-300">
                   <p className="text-gray-600 mb-4 leading-relaxed">{deal.description}</p>
                   <div className="space-y-2.5">
                     {deal.features?.map((feature, idx) => (
                       <div key={idx} className="flex items-center gap-2.5 text-gray-700 font-semibold">
                         <div className="bg-emerald-100 p-1 rounded-full text-emerald-600">
                            <Check size={10} strokeWidth={4} />
                         </div>
                         <span>{feature}</span>
                       </div>
                     ))}
                   </div>
                   <button className="w-full mt-6 bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition-colors">
                      Book Now
                   </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DealShowcase: React.FC = () => {
  return (
    <section className="py-12 space-y-12">
      <Section 
        title="Today's Top Deals" 
        subtitle="Curated packages with massive savings." 
        deals={FEATURED_DEALS} 
      />
      <Section 
        title="Stays for every travel style" 
        subtitle="From cozy cabins to luxury resorts." 
        deals={STAY_STYLE_DEALS} 
      />
      <Section 
        title="Bundle & Save!" 
        subtitle="Book flight + hotel together and save up to 20%." 
        deals={BUNDLE_DEALS} 
      />
    </section>
  );
};

export default DealShowcase;