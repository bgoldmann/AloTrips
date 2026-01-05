'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PRICE_HISTORY_DATA } from '../constants';
import { TrendingUp } from 'lucide-react';

interface PriceTrendChartProps {
  data?: Array<{ day: string; price: number }>;
  destination?: string;
  currency?: 'USD' | 'EUR';
}

const PriceTrendChart: React.FC<PriceTrendChartProps> = ({ 
  data = PRICE_HISTORY_DATA, 
  destination = 'Selected Destination', 
  currency = 'USD' 
}) => {
  const currencySymbol = currency === 'EUR' ? '€' : '$';
  
  // Simple conversion for mock data if currency is EUR
  const chartData = currency === 'EUR' 
    ? data.map(d => ({ ...d, price: Math.round(d.price * 0.92) })) 
    : data;

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h3 className="text-sm font-bold text-gray-800 mb-6 flex items-center gap-2">
        <div className="bg-orange-100 p-1.5 rounded-lg text-orange-600">
            <TrendingUp size={16} />
        </div>
        Price Trend for {destination}: Next 7 Days
      </h3>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{fontSize: 12, fill: '#9ca3af', fontWeight: 500}} 
              dy={10}
            />
            <YAxis hide domain={['dataMin - 50', 'dataMax + 50']} />
            <Tooltip 
              contentStyle={{
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  padding: '8px 12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)'
              }}
              formatter={(value: number) => [<span className="text-orange-600 font-bold">{currencySymbol}{value}</span>, 'Av. Price']}
              labelStyle={{ color: '#6b7280', fontSize: '12px', marginBottom: '4px' }}
              cursor={{ stroke: '#fdba74', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke="#ea580c" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorPrice)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-gray-500 mt-4 text-center bg-gray-50 py-2 rounded-lg border border-gray-100 flex items-center justify-center gap-2">
        <span>💡</span> 
        <span>
          <span className="font-semibold text-orange-600">Insider Tip:</span> Flying on Wednesday could save you approx. <span className="font-bold text-gray-800">{currencySymbol}60</span>.
        </span>
      </p>
    </div>
  );
};

export default PriceTrendChart;